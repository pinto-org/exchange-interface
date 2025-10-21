import { type ExchangeSDK, TestUtils } from '@exchange/sdk';
import { print } from './Print';
import { getMockAccountAlias } from './accounts';
import { chain, impersonate } from './setup';
import type { MayPromise } from './types.generics';

export interface ImpersonateWrapperCallbackParams {
  sdk: ExchangeSDK;
  account: string;
}

export type ImpersonateWrapperCallback = (params: ImpersonateWrapperCallbackParams) => Promise<unknown>;

const envPubKey = process.env.PUBKEY;

export const impersonateCallback = async (address: string | undefined = envPubKey, useChain = true) => {
  if (!address) {
    throw new Error('address is required.');
  }
  const getParams = async (debug: boolean) => {
    const alias = getMockAccountAlias(address);

    if (alias !== address) {
      print.label(`IMPERSONATING ${alias}: ${address}`);
    } else {
      print.label(`IMPERSONATING ${address}`);
    }

    const { sdk, stop } = await impersonate(address);

    sdk.diamondSDK.zeroX.setApiKey(process.env.ZEROX_API_KEY ?? '');
    sdk.DEBUG = debug;

    const account = await sdk.getAccount();

    return {
      sdk,
      address,
      account,
      stop
    };
  };

  const wrapperCallback = async (
    callback: ImpersonateWrapperCallback,
    options?: {
      // runs before beforeCallback.
      beforeBeforeCallback?: () => MayPromise<unknown>;
      beforeCallback?: ImpersonateWrapperCallback;
      debug?: boolean;
    }
  ) => {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    let snapshot: any;

    const { sdk, account, stop } = await getParams(options?.debug ?? false);

    await options?.beforeCallback?.({ sdk, account });

    try {
      if (useChain) {
        snapshot = await chain.snapshot();
        print.label('snapshot taken: ', snapshot);
      }
      await callback({ sdk, account });
    } catch (e) {
      console.error('FAILED: ', e);
    } finally {
      const alias = getMockAccountAlias(account);
      print.log(`STOPPING IMPERSONATION OF ${alias}`);
      stop();
      if (!!useChain && snapshot !== null && snapshot !== undefined) {
        await chain.revert(snapshot);
      }
      console.log('FINISHED!');
    }
  };

  return wrapperCallback;
};
