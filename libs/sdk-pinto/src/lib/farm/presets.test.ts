import { FarmWorkflow } from 'src/lib/farm/farm';
import { BlockchainUtils } from 'src/utils/TestUtils';
import { setupConnection } from '../../utils/TestUtils/provider';
import { PintoSDK } from '../PintoSDK';
import { FarmFromMode } from './types';

let account: string;
let sdk: PintoSDK;
let test: BlockchainUtils;

beforeAll(async () => {
  const { provider, signer, account: _account } = setupConnection();
  account = _account;
  sdk = new PintoSDK({
    provider,
    signer
  });
  test = new BlockchainUtils(sdk);
});

describe('Facet: Pipeline', () => {
  let farm: FarmWorkflow;
  let snapshot: number;

  beforeEach(async () => {
    test.resetFork();
    farm = sdk.farm.create();
    await test.sendBean(account, sdk.tokens.PINTO.amount(100));
  });

  describe('loading without approval', () => {
    it.skip('throws', async () => {
      // Setup
      const amount = sdk.tokens.PINTO.amount(100);
      farm.add(sdk.farm.presets.loadPipeline(sdk.tokens.PINTO, FarmFromMode.EXTERNAL));

      // Execute
      expect(async () => {
        await farm.execute(amount.toBigNumber(), { slippage: 0.1 }).then((r) => r.wait());
      }).toThrow();
    });
  });
});
