import { BigNumber } from 'ethers';
import isEqual from 'lodash/isEqual';

import { Well, ExchangeSDK } from '@exchange/sdk';

import { GetWellEventsDocument, TradeType } from 'src/generated/graph/graphql';
import { Settings } from 'src/settings';
import { Log } from 'src/utils/logger';

import { fetchFromSubgraphRequest } from './subgraphFetch';
import { AddEvent, BaseEvent, EVENT_TYPE, ShiftEvent, SwapEvent, WellEvent } from './useWellHistory';

const HISTORY_DAYS = 7;
const HISTORY_DAYS_AGO_BLOCK_TIMESTAMP = Math.floor(
  new Date(Date.now() - HISTORY_DAYS * 24 * 60 * 60 * 1000).getTime() / 1000
);

const loadFromChain = async (sdk: ExchangeSDK, well: Well): Promise<any[]> => {
  Log.module('history').debug('Loading history from blockchain');
  const contract = well.contract;
  const swapFilter = contract.filters.Swap();
  const addFilter = contract.filters.AddLiquidity();
  const removeFilter = contract.filters.RemoveLiquidity();
  const syncFilter = contract.filters.Sync();
  const shiftFilter = contract.filters.Shift();

  if (!well.lpToken) await well.getLPToken();

  const combinedFilter = {
    address: contract.address,
    topics: [
      [
        swapFilter?.topics?.[0] as string,
        addFilter?.topics?.[0] as string,
        removeFilter?.topics?.[0] as string,
        syncFilter?.topics?.[0] as string,
        shiftFilter?.topics?.[0] as string
      ]
    ]
  };

  const getEventType = (topics: string[]) => {
    if (isEqual(addFilter.topics, topics)) return EVENT_TYPE.ADD_LIQUIDITY;
    if (isEqual(removeFilter.topics, topics)) return EVENT_TYPE.REMOVE_LIQUIDITY;
    if (isEqual(swapFilter.topics, topics)) return EVENT_TYPE.SWAP;
    if (isEqual(syncFilter.topics, topics)) return EVENT_TYPE.SYNC;
    if (isEqual(shiftFilter.topics, topics)) return EVENT_TYPE.SHIFT;

    throw new Error('Unknown topics found: ' + topics);
  };

  const fromBlock = Number(Settings.WELLS_ORIGIN_BLOCK);
  const toBlock = 'latest';
  const events = await contract.queryFilter(combinedFilter, fromBlock, toBlock);

  Log.module('history').debug('Raw event data from blockchain: ', events);

  return events.sort(sortEventsDescByBlock).map((e) => {
    const type = getEventType(e.topics);
    const base: BaseEvent = {
      type,
      tx: e.transactionHash,
      block: e.blockNumber
    };

    if (type === EVENT_TYPE.SWAP) {
      const data = contract.interface.decodeEventLog('Swap', e.data, e.topics);
      const fromToken = well.getTokenByAddress(data.fromToken)!;
      const toToken = well.getTokenByAddress(data.toToken)!;
      const event: SwapEvent = {
        ...base,
        fromToken,
        fromAmount: fromToken.fromBlockchain(data.amountIn),
        toToken,
        toAmount: toToken.fromBlockchain(data.amountOut)
      };
      return event;
    }
    if (type === EVENT_TYPE.SHIFT) {
      const data = contract.interface.decodeEventLog('Shift', e.data, e.topics);
      const toToken = well.getTokenByAddress(data.toToken)!;
      const event: ShiftEvent = {
        ...base,
        toToken,
        toAmount: toToken.fromBlockchain(data.amountOut)
      };
      return event;
    }
    if (type === EVENT_TYPE.ADD_LIQUIDITY) {
      const data = contract.interface.decodeEventLog('AddLiquidity', e.data, e.topics);
      const event: AddEvent = {
        ...base,
        lpAmount: well.lpToken!.fromBlockchain(data.lpAmountOut),
        tokenAmounts: data.tokenAmountsIn.map((bn: BigNumber, i: number) => well.tokens![i].fromBlockchain(bn))
      };
      return event;
    }
    if (type === EVENT_TYPE.REMOVE_LIQUIDITY) {
      const data = contract.interface.decodeEventLog('RemoveLiquidity', e.data, e.topics);
      const event: AddEvent = {
        ...base,
        lpAmount: well.lpToken!.fromBlockchain(data.lpAmountIn),
        tokenAmounts: data.tokenAmountsOut.map((bn: BigNumber, i: number) => well.tokens![i].fromBlockchain(bn))
      };
      return event;
    }
    if (type === EVENT_TYPE.SYNC) {
      const data = contract.interface.decodeEventLog('Sync', e.data, e.topics);
      const event: AddEvent = {
        ...base,
        lpAmount: well.lpToken!.fromBlockchain(data.lpAmountOut),
        tokenAmounts: data.reserves.map((bn: BigNumber, i: number) => well.tokens![i].fromBlockchain(bn))
      };
      return event;
    }
    throw new Error('Should never reach here. Unknown event type: ' + type);
  });
};

const loadFromGraph = async (sdk: ExchangeSDK, well: Well) => {
  Log.module('history').debug('Loading history from Graph');

  if (!well.lpToken) await well.getLPToken();

  const data = await fetchFromSubgraphRequest(
    GetWellEventsDocument,
    {
      id: well.address,
      searchTimestamp: HISTORY_DAYS_AGO_BLOCK_TIMESTAMP
    },
    sdk.chainId
  );

  const results = await data();
  Log.module('history').debug('Raw event data from subgraph: ', results);

  const parsedEvents: WellEvent[] = ((results.well ?? {}).trades ?? []).map((e) => {
    if (e.tradeType === TradeType.Swap) {
      const fromToken = well.getTokenByAddress(e.swapFromToken!.id)!;
      const toToken = well.getTokenByAddress(e.swapToToken!.id)!;
      return {
        type: EVENT_TYPE.SWAP,
        fromToken,
        fromAmount: fromToken.fromBlockchain(e.swapAmountIn!),
        toToken,
        toAmount: toToken.fromBlockchain(e.swapAmountOut!),
        tx: e.hash,
        timestamp: e.timestamp,
      }
    } else {
      return {
        type: e.tradeType === TradeType.AddLiquidity ? EVENT_TYPE.ADD_LIQUIDITY : EVENT_TYPE.REMOVE_LIQUIDITY,
        lpAmount: well.lpToken!.fromBlockchain(e.liqLpTokenAmount),
        tokenAmounts: e.liqReservesAmount!.map((bn: BigNumber, i: number) => well.tokens![i].fromBlockchain(bn)),
        tx: e.hash,
        timestamp: e.timestamp,
      }
    }
  });
  return parsedEvents.sort(sortEventsDescByTimestamp);
};

const sortEventsDescByBlock = (a: any, b: any) => {
  const diff = b.blockNumber - a.blockNumber;
  if (diff !== 0) return diff;
  return b.logIndex - a.logIndex;
};

const sortEventsDescByTimestamp = (a: any, b: any) => {
  const diff = parseInt(b.timestamp) - parseInt(a.timestamp);
  return diff;
};

/**
 * In development, use the ENV var LOAD_HISTORY_FROM_GRAPH to decide. If missing
 * it will default to false (ie, load from blockchain)
 *
 * In production, use the Graph but failover to blockchain if there's an error
 */
export const loadHistory = async (sdk: ExchangeSDK, well: Well): Promise<WellEvent[]> => {
  if (import.meta.env.DEV && !Settings.LOAD_HISTORY_FROM_GRAPH) {
    return loadFromChain(sdk, well);
  }

  return loadFromGraph(sdk, well)
    .catch((err) => {
      Log.module('history').error('Error loading history from subgraph', err);
      Log.module('history').log('Trying blockchain...');
      return loadFromChain(sdk, well);
    })
    .catch((err) => {
      Log.module('history').error('Failed to load history from blockchain too :(', err);
      return [];
    });
};
