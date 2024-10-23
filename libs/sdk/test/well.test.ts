import { Well } from '../src/lib/Well';
import { getTestUtils } from './TestUtils/provider';
import { BlockchainUtils } from './TestUtils';
import { Token } from '@exchange/sdk-core';
import { ExchangeSDK } from '../src/lib/ExchangeSDK';
import { Aquifer, Pump, WellFunction } from '../src';

jest.setTimeout(30000);

let testWell: Well;
let testHelper: BlockchainUtils;
let wellAddress: string;
let ExchangeSDKInstance: ExchangeSDK;

beforeAll(async () => {
  const { ExchangeSDK } = getTestUtils();
  ExchangeSDKInstance = ExchangeSDK;
  const wellTokens = [ExchangeSDKInstance.tokens.PINTO, ExchangeSDKInstance.tokens.WETH];

  // Deploy test well
  const testAquifer = await Aquifer.BuildAquifer(ExchangeSDK);
  const wellFunction = await WellFunction.BuildConstantProduct(ExchangeSDK);
  const testWell = await Well.DeployViaAquifer(ExchangeSDK, testAquifer, wellTokens, wellFunction, []);
  wellAddress = testWell.address;
  testHelper = new BlockchainUtils(ExchangeSDKInstance);
});

afterAll(async () => {
  await testHelper.resetFork();
});

describe('Well', function () {
  beforeEach(() => {
    testWell = new Well(ExchangeSDKInstance, wellAddress);
  });

  describe('loadWell', () => {
    beforeEach(() => {
      testWell = new Well(ExchangeSDKInstance, wellAddress);
    });

    it('should load all properties by default', async () => {
      await testWell.loadWell();

      expect(testWell.name).toBeDefined();
      expect(testWell.lpToken).toBeDefined();
      expect(testWell.wellFunction).toBeDefined();
      expect(testWell.pumps).toBeDefined();
      expect(testWell.aquifer).toBeDefined();
      expect(testWell.tokens).toBeDefined();
      expect(testWell.reserves).toBeDefined();
    });

    it('should load only specified properties', async () => {
      await testWell.loadWell({
        name: true,
        lpToken: true
      });

      expect(testWell.name).toBeDefined();
      expect(testWell.lpToken).toBeDefined();
      expect(testWell.wellFunction).toBeUndefined();
      expect(testWell.pumps).toBeUndefined();
      expect(testWell.aquifer).toBeUndefined();
      expect(testWell.tokens).toBeUndefined();
      expect(testWell.reserves).toBeUndefined();
    });
  });

  describe('getWell', () => {
    it('should return the tokens, Well function, pumps, and aquifer associated with the well', async () => {
      const wellDetails = await testWell.getWell();
      expect(wellDetails.tokens).toBeDefined();
      expect(wellDetails.wellFunction).toBeDefined();
      expect(wellDetails.pumps).toBeDefined();
      expect(wellDetails.aquifer).toBeDefined();
    });

    it('should set the tokens if they are not already set', async () => {
      testWell.tokens = undefined;
      await testWell.getWell();
      expect(testWell.tokens).toBeDefined();
    });

    it('should set the Well function if it is not already set', async () => {
      testWell.wellFunction = undefined;
      await testWell.getWell();
      expect(testWell.wellFunction).toBeDefined();
    });

    it('should set the pumps if they are not already set', async () => {
      testWell.pumps = undefined;
      await testWell.getWell();
      expect(testWell.pumps).toBeDefined();
    });

    it('should set the aquifer if it is not already set', async () => {
      testWell.aquifer = undefined;
      await testWell.getWell();
      expect(testWell.aquifer).toBeDefined();
    });
  });

  describe('getName', () => {
    it('should return the name and cache the value after the first call', async () => {
      expect(testWell.name).toBeUndefined();
      const name = await testWell.getName();
      expect(name).toBeDefined();
      expect(testWell.name).toBeDefined();
    });
  });

  describe('getTokens', () => {
    it('should return the tokens and cache the value after the first call', async () => {
      expect(testWell.tokens).toBeUndefined();
      const tokens = await testWell.getTokens();
      expect(tokens).toBeDefined();
      expect(testWell.tokens).toBeDefined();
    });
  });

  describe('getWellFunction', () => {
    it('should return the pumps and cache the value after the first call', async () => {
      expect(testWell.wellFunction).toBeUndefined();
      const wellFunction = await testWell.getWellFunction();
      expect(wellFunction).toBeDefined();
      expect(testWell.wellFunction).toBeDefined();
    });
  });

  describe('getPumps', () => {
    it('should return the pumps and cache the value after the first call', async () => {
      expect(testWell.pumps).toBeUndefined();
      const pumps = await testWell.getPumps();
      expect(pumps).toBeDefined();
      expect(testWell.pumps).toBeDefined();
    });
  });

  describe('getAquifer', () => {
    it('should return the aquifer and cache the value after the first call', async () => {
      expect(testWell.aquifer).toBeUndefined();
      const aquifer = await testWell.getAquifer();
      expect(aquifer).toBeDefined();
      expect(testWell.aquifer).toBeDefined();
    });
  });

  describe('getReserves', () => {
    it('should return the reserves and cache the value after the first call', async () => {
      expect(testWell.reserves).toBeUndefined();
      const reserves = await testWell.getReserves();
      expect(reserves).toBeDefined();
      expect(testWell.reserves).toBeDefined();
    });
  });

  describe('Deploy', () => {
    let aquifer: Aquifer;
    beforeAll(async () => {
      aquifer = await Aquifer.BuildAquifer(ExchangeSDKInstance);
    });

    describe('when pump is specified', () => {
      it('should deploy a new well', async () => {
        const wellTokens = [ExchangeSDKInstance.tokens.PINTO, ExchangeSDKInstance.tokens.WETH];
        const mockPump = await Pump.BuildMockPump(ExchangeSDKInstance);
        const wellFunction = await WellFunction.BuildConstantProduct(ExchangeSDKInstance);
        const deployedWell = await Well.DeployViaAquifer(ExchangeSDKInstance, aquifer, wellTokens, wellFunction, [
          mockPump
        ]);

        expect(await deployedWell.getName()).toEqual('PINTO:WETH Constant Product Well');

        const wellLpToken = await deployedWell.getLPToken();
        expect(wellLpToken.symbol).toEqual('PINTOWETHCPw');

        expect((await deployedWell.getWellFunction()).address).toEqual(wellFunction.address);

        const wellPumps = await deployedWell.getPumps();
        expect(JSON.stringify(wellPumps)).toEqual(JSON.stringify([mockPump]));

        expect((await deployedWell.getAquifer()).address).toEqual(aquifer.address);

        expect(deployedWell).toHaveProperty('tokens');
        expect(deployedWell).toHaveProperty('reserves');
      });
    });

    describe('when pump is not specified', () => {
      it('should deploy a new well', async () => {
        const wellTokens = [ExchangeSDKInstance.tokens.PINTO, ExchangeSDKInstance.tokens.WETH];
        const wellFunction = await WellFunction.BuildConstantProduct(ExchangeSDKInstance);
        const deployedWell = await Well.DeployViaAquifer(ExchangeSDKInstance, aquifer, wellTokens, wellFunction, []);
        expect(deployedWell).toBeDefined();
        expect(await deployedWell.getName()).toEqual('PINTO:WETH Constant Product Well');
        const wellLpToken = await deployedWell.getLPToken();
        expect(wellLpToken.symbol).toEqual('PINTOWETHCPw');
        expect(deployedWell).toHaveProperty('address');
        expect(deployedWell).toHaveProperty('name');
        expect(deployedWell).toHaveProperty('lpToken');
        expect(deployedWell).toHaveProperty('wellFunction');
        expect(deployedWell).toHaveProperty('pumps');
        expect(deployedWell).toHaveProperty('aquifer');
        expect(deployedWell).toHaveProperty('tokens');
        expect(deployedWell).toHaveProperty('reserves');
      });
    });
  });
});
