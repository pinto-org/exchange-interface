import { BasinWell } from '@exchange/sdk';
import { Token, TokenValue } from '@exchange/sdk-core';
import { ethers } from 'ethers';

import type { Chalk } from 'chalk';
const chalk = require('chalk') as Chalk;

const lightGray = (value: string) => chalk.hex('#9ba19d')(value);

function wrapWithName(text: string, inner: string) {
  return lightGray(text + '(') + inner + lightGray(')');
}

function keyValues(vals: [key: string, value: unknown][]) {
  const all = vals.map(([key, value], i) => {
    return chalk.green(`${key}: `) + chalk.yellow(value);
  });

  return all.join(', ').slice(0, -1);
}

TokenValue.prototype[Symbol.for('nodejs.util.inspect.custom')] = function () {
  return wrapWithName(
    this.constructor.name,
    keyValues([
      ['human', this.toNumber()],
      ['blockchain', this.blockchainString]
    ])
  );
};

ethers.BigNumber.prototype[Symbol.for('nodejs.util.inspect.custom')] = function () {
  return wrapWithName('ethers', chalk.blue(this.toString()));
};

Token.prototype[Symbol.for('nodejs.util.inspect.custom')] = function () {
  return wrapWithName(
    this.constructor.name,
    keyValues([
      ['symbol', this.symbol],
      ['address', this.address]
    ])
  );
};

Token.prototype[Symbol.for('nodejs.util.inspect.custom')] = function () {
  return wrapWithName(
    this.constructor.name,
    keyValues([
      ['symbol', this.symbol],
      ['address', this.address]
    ])
  );
};

BasinWell.prototype[Symbol.for('nodejs.util.inspect.custom')] = function () {
  return wrapWithName(
    this.constructor.name,
    keyValues([
      ['symbol', this.symbol],
      ['address', this.address],
      ['lpToken', this.lpToken.symbol],
      ['tokens', this.tokens.map((t) => t.symbol)]
    ])
  );
};

class Logger {
  private maxDepth: number;

  constructor(maxDepth = 4) {
    this.maxDepth = maxDepth;
  }

  setMaxDepth(maxDepth: number) {
    this.maxDepth = maxDepth;
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  label(...args: any[]): void {
    this.log(chalk.green(...args));
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  shallow(...args: any[]): void {
    const processedArgs = args.map((arg) => {
      if (typeof arg === 'object' && arg !== null) {
        if (typeof window !== 'undefined' && window.document) {
          // Browser environment
          return this.stringify(arg, this.maxDepth);
        } else {
          // Node.js environment
          const util = require('util');
          return util.inspect(arg, { depth: 2, colors: true });
        }
      } else {
        return arg;
      }
    });
    console.log(...processedArgs);
  }

  log(...args: any[]): void {
    const processedArgs = args.map((arg) => {
      if (typeof arg === 'object' && arg !== null) {
        if (typeof window !== 'undefined' && window.document) {
          // Browser environment
          return this.stringify(arg, this.maxDepth);
        } else {
          // Node.js environment
          const util = require('util');
          return util.inspect(arg, { depth: this.maxDepth, colors: true });
        }
      } else {
        return arg;
      }
    });
    console.log(...processedArgs);
  }

  deep(...args: any[]): void {
    const processedArgs = args.map((arg) => {
      if (typeof arg === 'object' && arg !== null) {
        if (typeof window !== 'undefined' && window.document) {
          // Browser environment
          return this.stringify(arg, this.maxDepth);
        } else {
          // Node.js environment
          const util = require('util');
          return util.inspect(arg, { depth: 6, colors: true });
        }
      } else {
        return arg;
      }
    });
    console.log(...processedArgs);
  }

  private stringify(obj: any, maxDepth: number, currentDepth = 0): string {
    if (currentDepth >= maxDepth) {
      return '[Object]';
    }

    if (obj === null) {
      return 'null';
    }

    if (typeof obj !== 'object') {
      return JSON.stringify(obj);
    }

    if (Array.isArray(obj)) {
      const items = obj.map((item) => this.stringify(item, maxDepth, currentDepth + 1));
      return `[${items.join(', ')}]`;
    }

    const entries = Object.entries(obj).map(([key, value]) => {
      return `"${key}": ${this.stringify(value, maxDepth, currentDepth + 1)}`;
    });

    return `{ ${entries.join(', ')} }`;
  }

  error(...args: any[]) {
    this.log(chalk.red(...args));
  }
}

export const print = new Logger(4);
