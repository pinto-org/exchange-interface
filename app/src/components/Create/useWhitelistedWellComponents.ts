import { useMemo } from 'react';

import { ChainId } from '@exchange/sdk-core';

import Code4renaLogo from 'src/assets/images/code4rena-logo.png';
import codeHawksLogo from 'src/assets/images/codehawks-logo.png';
import CyrfinLogo from 'src/assets/images/cyrfin-logo.svg';
import HalbornLogo from 'src/assets/images/halborn-logo.png';
import { AddressMap } from 'src/types';
import { toAddressMap } from 'src/utils/addresses';
import { getChainExplorer } from 'src/utils/chain';
import useSdk from 'src/utils/sdk/useSdk';
import { usePumps } from 'src/wells/pump/usePumps';
import { useWellImplementations } from 'src/wells/useWellImplementations';
import { useWells } from 'src/wells/useWells';
import { useWellFunctions } from 'src/wells/wellFunction/useWellFunctions';

export enum WellComponentType {
  WellImplementation = 'WellImplementation',
  Pump = 'Pump',
  WellFunction = 'WellFunction'
}

type BaseInfo = {
  value: string;
  imgSrc?: string;
  url?: string;
};

type ComponentInfo = Omit<BaseInfo, 'value'> & {
  label: string;
  value: string | BaseInfo[];
};

export type WellComponentInfo = {
  address: string;
  component: {
    name: string;
    fullName?: string;
    summary: string;
    description: string[];
    url?: string;
    usedBy: number;
    type: {
      type: WellComponentType;
      display: string;
    };
  };
  info: ComponentInfo[];
  links: {
    explorer?: string;
    github?: string;
    learnMore?: string;
  };
};

const code4ArenaAuditLink = 'https://code4rena.com/reports/2023-07-basin';
const halbornAuditLink =
  'https://github.com/BeanstalkFarms/Beanstalk-Audits/blob/main/ecosystem/06-16-23-basin-halborn-report.pdf';
const cyfrinAuditLink =
  'https://github.com/BeanstalkFarms/Beanstalk-Audits/blob/main/ecosystem/06-16-23-basin-cyfrin-report.pdf';

const codeHawksMFPAndCP2AuditLink =
  'https://codehawks.cyfrin.io/c/2024-04-Beanstalk-DIB/results?lt=contest&page=1&sc=reward&sj=reward&t=report';

const basinAuditInfo = [
  {
    value: 'Cyfrin',
    imgSrc: CyrfinLogo,
    url: cyfrinAuditLink
  },
  {
    value: 'Halborn',
    imgSrc: HalbornLogo,
    url: halbornAuditLink
  },
  {
    value: 'Code4rena',
    imgSrc: Code4renaLogo,
    url: code4ArenaAuditLink
  }
];

const codehawksAuditInfo = [
  {
    value: 'CodeHawks',
    imgSrc: codeHawksLogo,
    url: codeHawksMFPAndCP2AuditLink
  }
];

const WellDotSol: WellComponentInfo = {
  address: '',
  component: {
    name: 'Well.sol',
    summary: 'A standard Well implementation that prioritizes flexibility and composability.',
    description: [
      'A standard Well implementation that prioritizes flexibility and composability.',
      'Fits many use cases for a Well.'
    ],
    usedBy: 0,
    type: {
      type: WellComponentType.WellImplementation,
      display: '🪣 Well Implementation'
    },
    url: 'https://github.com/pintomoney/exchange/blob/main/src/Well.sol'
  },
  info: [
    { label: 'Block Deployed', value: '17562613' },
    { label: 'Audited by', value: basinAuditInfo }
  ],
  links: {
    github: 'https://github.com/pintomoney/exchange/blob/main/src/Well.sol',
    learnMore: 'https://github.com/pintomoney/exchange/blob/main/src/Well.sol'
  }
};

const MultiFlowPump: WellComponentInfo = {
  address: '',
  component: {
    name: 'Multi Flow',
    fullName: 'Multi Flow Pump',
    summary: 'An inter-block MEV manipulation resistant oracle implementation.',
    description: [
      'Comprehensive multi-block MEV manipulation-resistant oracle implementation which serves up Well pricing data with an EMA for instantaneous prices and a TWAP for weighted averages over time.'
    ],
    usedBy: 0,
    url: 'https://pinto-exchange.gitbook.io/implementations/multi-flow-pump',
    type: {
      type: WellComponentType.Pump,
      display: '🔮 Pump'
    }
  },
  info: [
    { label: 'Deployed Block', value: '21191372' },
    { label: 'Audited by', value: [...basinAuditInfo, ...codehawksAuditInfo] }
  ],
  links: {
    github: 'https://github.com/pintomoney/exchange/blob/main/src/pumps/MultiFlowPump.sol',
    learnMore: 'https://github.com/pintomoney/exchange/blob/main/src/pumps/MultiFlowPump.sol'
  }
};

const ConstantProduct2: WellComponentInfo = {
  address: '',
  component: {
    name: 'Constant Product 2',
    summary: 'A standard x*y = k token pricing function for two tokens.',
    description: ['A standard x*y = k token pricing function for two tokens.'],
    url: 'https://github.com/pintomoney/exchange/blob/main/src/functions/ConstantProduct2.sol',
    type: {
      type: WellComponentType.WellFunction,
      display: ' 🏷️ Well Function'
    },
    usedBy: 0
  },
  info: [
    { label: 'Deployed Block', value: '21191373' },
    { label: 'Audited by', value: [...basinAuditInfo, ...codehawksAuditInfo] }
  ],
  links: {
    github: 'https://github.com/pintomoney/exchange/blob/main/src/functions/ConstantProduct2.sol',
    learnMore: 'https://github.com/pintomoney/exchange/blob/main/src/functions/ConstantProduct2.sol'
  }
};

type WellComponentMap<T> = {
  wellImplementations: T;
  pumps: T;
  wellFunctions: T;
};

const getComponentWithUpdateLinks = (wellComponent: WellComponentInfo, chainId: ChainId, address: string) => {
  return {
    ...wellComponent,
    address,
    links: {
      ...wellComponent.links,
      explorer: getChainExplorer(chainId).address(address)
    }
  };
};

export const useWhitelistedWellComponents = () => {
  const { data: wells } = useWells();
  const { data: implementations } = useWellImplementations();
  const wellFunctions = useWellFunctions();
  const pumps = usePumps();
  const sdk = useSdk();

  const whitelist = useMemo(() => {
    // set Addresses
    const wellDotSol = getComponentWithUpdateLinks(
      WellDotSol,
      sdk.chainId,
      sdk.addresses.WELL_DOT_SOL.get(sdk.chainId)
    );
    const multiFlow = getComponentWithUpdateLinks(
      MultiFlowPump,
      sdk.chainId,
      sdk.addresses.MULTI_FLOW_PUMP.get(sdk.chainId)
    );
    const cp2 = getComponentWithUpdateLinks(
      ConstantProduct2,
      sdk.chainId,
      sdk.addresses.CONSTANT_PRODUCT_2.get(sdk.chainId)
    );

    return {
      wellImplementations: {
        [wellDotSol.address]: wellDotSol
      },
      pumps: {
        [multiFlow.address]: multiFlow
      },
      wellFunctions: {
        [cp2.address]: cp2
      }
    };
  }, [sdk]);

  return useMemo(() => {
    // make deep copy of ComponentWhiteList
    const map = JSON.parse(JSON.stringify(whitelist)) as WellComponentMap<AddressMap<WellComponentInfo>>;

    const pumpMap = toAddressMap(pumps, { keyLowercase: true });
    const wellFunctionMap = toAddressMap(wellFunctions, { keyLowercase: true });

    for (const well of wells || []) {
      // increase usedBy count for each whitelisted well component
      if (implementations) {
        const implementation = implementations[well.address.toLowerCase()];
        if (implementation in map.wellImplementations) {
          map.wellImplementations[implementation].component.usedBy += 1;
        }
      }

      well.pumps?.forEach((pump) => {
        const pumpAddress = pump.address.toLowerCase();
        if (pumpAddress in pumpMap && pumpAddress in map.pumps) {
          map.pumps[pumpAddress].component.usedBy += 1;
        }
      });

      if (well.wellFunction) {
        const wellFunctionAddress = well.wellFunction.address.toLowerCase();
        if (wellFunctionAddress in wellFunctionMap && wellFunctionAddress in map.wellFunctions) {
          map.wellFunctions[wellFunctionAddress].component.usedBy += 1;
        }
      }
    }

    const components: WellComponentMap<WellComponentInfo[]> = {
      wellImplementations: Object.values(map.wellImplementations),
      pumps: Object.values(map.pumps),
      wellFunctions: Object.values(map.wellFunctions)
    };

    return {
      components,
      lookup: map
    };
  }, [whitelist, implementations, pumps, wellFunctions, wells]);
};
