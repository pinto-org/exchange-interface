import React, { useEffect, useState } from 'react';

import { ethers } from 'ethers';
import toast from 'react-hot-toast';
import styled from 'styled-components';
import { useAccount } from 'wagmi';

import { ExchangeSDK, getTokenIndex, TestUtils } from '@exchange/sdk';
import { Token, TokenValue } from '@exchange/sdk-core';

import { Flex } from 'src/components/Layout';
import { Page } from 'src/components/Page';
import { Title } from 'src/components/PageComponents/Title';
import { Button } from 'src/components/Swap/Button';
import { TokenInput } from 'src/components/Swap/TokenInput';
import { ToastAlert } from 'src/components/TxnToast/ToastAlert';
import { Text } from 'src/components/Typography';
import { useAllTokensBalance } from 'src/tokens/useAllTokenBalance';
import { useTokensArr } from 'src/tokens/useTokens';
import { useEthersProvider } from 'src/utils/wagmi/ethersAdapter';
import { useWells } from 'src/wells/useWells';

export const Dev = () => {
  const provider = useEthersProvider();
  const account = useAccount();
  const data = useTokensArr();

  const { data: wells } = useWells();

  const [amounts, setAmounts] = useState<Map<string, TokenValue>>(new Map());
  const { refetch: refetchTokenBalances } = useAllTokensBalance();
  const sdk = new ExchangeSDK({ provider: provider as ethers.providers.JsonRpcProvider });
  const [tokens, setTokens] = useState<Set<Token>>(new Set(data || []));

  useEffect(() => {
    setTokens(new Set(data || []));
  }, [data]);

  const rows = [];

  const goBalance = async (token: Token) => {
    const amount = amounts.get(token.symbol) || TokenValue.ZERO;
    const utils = new TestUtils.BlockchainUtils(sdk.diamondSDK);
    if (token.equals(sdk.tokens.ETH)) {
      await utils.setETHBalance(account.address || '', amount, false);
    } else {
      await utils.setBalance(token, account.address || '', amount, false);
    }
    await mine();
    await refetchTokenBalances();
    toast.success(<ToastAlert desc={`Set ${token.symbol} balance to  ${amount.toHuman('short')}`} />);
  };

  const setMockBalance = async (token: Token) => {
    const amount = amounts.get(token.symbol) || TokenValue.ZERO;
    const utils = new TestUtils.BlockchainUtils(sdk.diamondSDK);
    await utils.setBalance(token, account.address || '', amount, true);
    await mine();
    await refetchTokenBalances();
    toast.success(<ToastAlert desc={`Set ${token.symbol} balance to  ${amount.toHuman('short')}`} />);
  };

  const clearApproval = async (token: Token) => {
    await token.approve('0xDEb0f04e5DC8875bf1Dc6087fF436Ef9873b8933', TokenValue.ZERO); //depot
    toast.success(<ToastAlert desc={`Revoked ${token.symbol} allowance for Depot`} />);
    for await (const well of wells || []) {
      const allowance = await token.getAllowance(account.address || '', well.address);
      if (!allowance || allowance.eq(TokenValue.ZERO)) continue;
      await token.approve(well.address, TokenValue.ZERO); //depot
      toast.success(<ToastAlert desc={`Revoked ${token.symbol} allowance for ${well.name}`} />);
    }

    mine();
  };

  const mine = async () => {
    const utils = new TestUtils.BlockchainUtils(sdk.diamondSDK);
    await utils.mine();
    toast.success(<ToastAlert desc={`Mined a new block`} />);
  };

  for (let token of tokens) {
    if (!sdk.tokens.findByAddress(getTokenIndex(token))) {
      continue;
    }
    rows.push(
      <Row key={token.symbol}>
        <Flex $fullWidth $minWidth={300}>
          <TokenInput
            width='100%'
            token={token}
            canChangeToken={false}
            label='token'
            loading={false}
            amount={amounts.get(token.symbol)}
            onAmountChange={(amount) => {
              setAmounts(new Map(amounts.set(token.symbol, amount)));
            }}
          />
        </Flex>
        <Flex $gap={0.5} $fullWidth $mt={1}>
          <Text $variant='s' $weight='semi-bold'>
            Set Balance
          </Text>
          <Flex $gap={1} $direction='row' $fullWidth>
            <Button
              onClick={() => {
                goBalance(token);
              }}
              label={'Set Balance'}
              disabled={false}
              loading={false}
            />
            <Button
              onClick={() => {
                setMockBalance(token);
              }}
              label={'Set Balance (mock)'}
              disabled={false}
              loading={false}
            />
          </Flex>
        </Flex>
        <Button
          secondary
          onClick={() => {
            clearApproval(token);
          }}
          label={'Clear Approvals (multi tx)'}
          disabled={false}
          loading={false}
        />
      </Row>
    );
  }

  return (
    <Page>
      <Title title='Developer' />
      <span>Give yourself some tokens</span>
      <Container>{rows}</Container>
      <hr />
      <Row>
        <Button onClick={mine} label={'Mine Block'} disabled={false} loading={false} />
      </Row>
    </Page>
  );
};

const Row = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 400px;
`;

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  width: 100%;
  grid-gap: 10px;
`;
