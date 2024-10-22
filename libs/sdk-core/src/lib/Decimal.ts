import { BigNumber } from 'ethers';
import { formatUnits, parseUnits, commify } from 'ethers/lib/utils';
import { assert } from 'src/utils';
// prettier-ignore
// Class copied from sushiswap
// https://github.com/sushiswap/mev-router-devkit/blob/6c94562561797fe11216e7e656828906d783ca79/src/Decimal.ts
export class Decimal {
  private _decimals: number;
  private _value: BigNumber;

  /**
   * Creates a new instance of `Decimal`.
   *
   * @description This class expects and suggests that numbers be handled using `Decimal`, instead of the inherently inaccurate
   * use of `number` and `string` types.
   *
   * The constructor accepts the following as inputs to the number parameter:
   * - `BigNumber` (from @ethersproject/bignumber): to easily shift from `BigNumber` used in smart contracts to `Decimal`
   * - `string`: to take input from the user
   *
   * Given these design decisions, there are some recommended approaches:
   * - Obtain user input with type text, instead of a number, in order to retain precision. e.g. `<input type="text" />`
   * - Where a `number` value is present, convert it to a `Decimal` in the manner the developer deems appropriate.
   *   This will most commonly be `new Decimal((1000222000.2222).toString(), 4)`. While a convenience method could be offered,
   *   it could lead to unexpected behaviour around precision.
   *
   * @param value the BigNumber or string used to initialize the object
   * @param decimals the number of decimal places supported by the number. If `number` is a string, this parameter is optional.
   * @returns a new, immutable instance of `Decimal`
   */
  constructor(value: string, decimals?: number);
  constructor(value: BigNumber, decimals: number);
  constructor(value: BigNumber | BigNumber | string, decimals?: number) {
    if (typeof value === "string") {
      const _value = value.trim() === "" || isNaN(Number(value)) ? "0" : value;
      const _decimals = decimals === undefined ? this._inferDecimalAmount(value) : this._ensurePositive(decimals);
      const formatted = this._setDecimalAmount(_value, _decimals);

      this._value = parseUnits(formatted, _decimals);
      this._decimals = _decimals;

      return;
    }

    assert(decimals !== undefined, "Decimal cannot be undefined");

    this._value = value;
    this._decimals = decimals;
  }

  public getDecimals(): number {
    return this._decimals;
  }

  private _inferDecimalAmount(value: string): number {
    const [, decimalStringOrUndefined] = value.split(".");

    return decimalStringOrUndefined?.length || 0;
  }

  /**
   * Sets a value to a specific decimal amount
   *
   * Trims unnecessary decimals
   * Or pads decimals if needed
   *
   * @param value Input value as a string
   * @param decimals Desired decimal amount
   */
  private _setDecimalAmount(value: string, decimals: number): string {
    const [integer, _decimalsOrUndefined] = value.split(".");

    const _decimals = _decimalsOrUndefined || "";

    const paddingRequired = this._ensurePositive(decimals - _decimals.length);

    return integer + "." + _decimals.substring(0, decimals) + "0".repeat(paddingRequired);
  }

  /**
   * Ensures the desired decimal amount is positive
   */
  private _ensurePositive(decimals: number) {
    return Math.max(0, decimals);
  }

  /**
   * Converts this value to a BigNumber
   *
   * Often used when passing this value as
   * an argument to a contract method
   */
  public toBigNumber(decimals?: number): BigNumber {
    return decimals === undefined ? this._value : new Decimal(this.toString(), decimals)._value;
  }
  /**
   * Converts to a different decimal
   */
  public reDecimal(decimals: number): Decimal {
    return decimals === this._decimals ? this : new Decimal(this.toString(), decimals);
  }

  /**
   * Converts this value to a string
   *
   * By default, the string returned will:
   * - Have the same decimal amount that it was initialized with
   * - Have trailing zeroes removed
   * - Not have thousands separators
   *
   * This ensures that the number string is accurate.
   *
   * To override any of these settings, add the `args` object as a parameter.
   *
   * @param args an object containing any of the properties: decimals, trim, format
   * @returns a string version of the number
   */
  public toString({
    decimals,
    trim = true,
    format = false
  }: {
    trim?: boolean;
    format?: boolean;
    decimals?: number;
  } = {}): string {
    let result = formatUnits(this._value, this._decimals);

    // Add thousands separators
    if (format) result = commify(result);

    // We default to the number of decimal places specified
    const _decimals = decimals === undefined ? this._decimals : this._ensurePositive(decimals);
    result = this._setDecimalAmount(result, _decimals);

    // We default to trimming trailing zeroes (and decimal points), unless there is an override
    if (trim) result = result.replace(/(?:\.|(\..*?))\.?0*$/, "$1");

    return result;
  }

  /**
   * @deprecated
   * Please avoid using this method.
   * If used for calculations: rather than converting this Decimal
   * "down" to a number, convert the other number "up" to a Decimal.
   *
   * Used when performing approximate calculations with
   * the number where precision __is not__ important.
   *
   * Ex: (new Decimal("100", 6)).toApproxNumber() => 100
   */
  public toApproxNumber(): number {
    return parseFloat(this.toString());
  }

  /**
   * Determines if the two values are equal
   */
  public eq(value: Decimal | string): boolean {
    const valueAsDBN = value instanceof Decimal ? value : new Decimal(value);

    // Normalize decimals to the largest of the two values
    const largestDecimalAmount = Math.max(valueAsDBN._decimals, this._decimals);

    // Normalize values to the correct decimal amount
    const normalisedThis = new Decimal(this.toString(), largestDecimalAmount);
    const normalisedValue = new Decimal(valueAsDBN.toString(), largestDecimalAmount);

    return normalisedThis._value.eq(normalisedValue._value);
  }

  /**
   * Subtracts this value by the value provided
   */
  public sub(value: Decimal | string): Decimal {
    const valueAsDBN = value instanceof Decimal ? value : new Decimal(value);

    // Normalize decimals to the largest of the two values
    const largestDecimalAmount = Math.max(valueAsDBN._decimals, this._decimals);

    // Normalize values to the correct decimal amount
    const normalisedThis = new Decimal(this.toString(), largestDecimalAmount);
    const normalisedValue = new Decimal(valueAsDBN.toString(), largestDecimalAmount);

    return new Decimal(normalisedThis._value.sub(normalisedValue._value), largestDecimalAmount);
  }

  /**
   * Sums this value and the value provided
   */
  public add(value: Decimal | string): Decimal {
    const valueAsDBN = value instanceof Decimal ? value : new Decimal(value);

    // Normalize decimals to the largest of the two values
    const largestDecimalAmount = Math.max(valueAsDBN._decimals, this._decimals);

    // Normalize values to the correct decimal amount
    const normalisedThis = new Decimal(this.toString(), largestDecimalAmount);
    const normalisedValue = new Decimal(valueAsDBN.toString(), largestDecimalAmount);

    return new Decimal(normalisedThis._value.add(normalisedValue._value), largestDecimalAmount);
  }

  public isPositive(): boolean {
    return this._value.gte(0);
  }

  /**
   * Determines if this value is greater than the provided value
   */
  public gt(value: Decimal | string): boolean {
    const valueAsDBN = value instanceof Decimal ? value : new Decimal(value);

    // Normalize decimals to the largest of the two values
    const largestDecimalAmount = Math.max(valueAsDBN._decimals, this._decimals);

    // Normalize values to the correct decimal amount
    const normalisedThis = new Decimal(this.toString(), largestDecimalAmount);
    const normalisedValue = new Decimal(valueAsDBN.toString(), largestDecimalAmount);

    return normalisedThis._value.gt(normalisedValue._value);
  }

  /**
   * Determines if this value is greater than or equal to the provided value
   */
  public gte(value: Decimal | string): boolean {
    return this.gt(value) || this.eq(value);
  }

  /**
   * Determines if this value is less than the provided value
   */
  public lt(value: Decimal | string): boolean {
    const valueAsDBN = value instanceof Decimal ? value : new Decimal(value);

    // Normalize decimals to the largest of the two values
    const largestDecimalAmount = Math.max(valueAsDBN._decimals, this._decimals);

    // Normalize values to the correct decimal amount
    const normalisedThis = new Decimal(this.toString(), largestDecimalAmount);
    const normalisedValue = new Decimal(valueAsDBN.toString(), largestDecimalAmount);

    return normalisedThis._value.lt(normalisedValue._value);
  }

  /**
   * Determines if this value is less than or equal to the provided value
   */
  public lte(value: Decimal | string): boolean {
    return this.lt(value) || this.eq(value);
  }

  /**
   * Multiplies this value by the provided value
   */
  public mul(value: Decimal | string): Decimal {
    const valueAsDBN = value instanceof Decimal ? value : new Decimal(value);

    const product = this._value.mul(valueAsDBN._value);

    // Multiplying two BigNumbers produces a product with a decimal
    // amount equal to the sum of the decimal amounts of the two input numbers
    return new Decimal(product, this._decimals + valueAsDBN._decimals);
  }

  public mod(value: Decimal | string): Decimal {
    const valueAsDBN = value instanceof Decimal ? value : new Decimal(value);

    return new Decimal(this._value.mod(valueAsDBN._value), this._decimals);
  }

  public mulMod(value: Decimal | string, denominator: Decimal | string): Decimal {
    const valueAsDBN = value instanceof Decimal ? value : new Decimal(value);
    const denominatorAsDBN = denominator instanceof Decimal ? denominator : new Decimal(denominator);

    const result = this._value.mul(valueAsDBN._value).mod(denominatorAsDBN._value);
    return new Decimal(result, this._decimals);
  }

  public mulDiv(value: Decimal | string, denominator: Decimal | string, rounding?: "up" | "down"): Decimal {
    const valueAsDBN = value instanceof Decimal ? value : new Decimal(value);
    const denominatorAsDBN = denominator instanceof Decimal ? denominator : new Decimal(denominator);

    let result = this._value.mul(valueAsDBN._value).div(denominatorAsDBN._value);
    if (rounding === "up" && this.mulMod(value, denominator).gt("0")) {
      result = result.add(1);
    }

    return new Decimal(result, this._decimals);
  }

  /**
   * Divides this value by the provided value
   *
   * By default, this returns a value whose decimal amount is equal
   * to the sum of the decimal amounts of the two values used.
   * If this isn't enough, you can specify a desired
   * decimal amount using the second function argument.
   *
   * @param decimals The expected decimal amount of the output value
   */
  public div(value: Decimal | string, decimals?: number): Decimal {
    const valueAsDBN = value instanceof Decimal ? value : new Decimal(value);

    const _decimals = decimals === undefined ? this._decimals + valueAsDBN._decimals : this._ensurePositive(decimals);

    // When we divide two BigNumbers, the result will never
    // include any decimal places because BigNumber only deals
    // with whole integer values. Therefore, in order for us to
    // include a specific decimal amount in our calculation, we need to
    // normalize the decimal amount of the two numbers, such that the difference
    // in their decimal amount is equal to the expected decimal amount
    // of the result, before we do the calculation
    //
    // E.g:
    // 22/5 = 4.4
    //
    // But ethers would return:
    // 22/5 = 4 (no decimals)
    //
    // So before we calculate, we add n padding zeros to the
    // numerator, where n is the expected decimal amount of the result:
    // 220/5 = 44
    //
    // Normalized to the expected decimal amount of the result
    // 4.4

    const normalisedThis = new Decimal(this.toString(), _decimals + valueAsDBN._decimals);

    const quotient = normalisedThis._value.div(valueAsDBN._value);

    // Return result with the expected output decimal amount
    return new Decimal(quotient, _decimals);
  }

  public abs(): Decimal {
    if (this._value.lt(0)) {
      return new Decimal(this._value.mul("-1"), this._decimals);
    } else {
      return this;
    }
  }

  //only works for positive exponents
  public pow(n: number): Decimal {
    if (n == 0) return new Decimal("1");
    else if (n == 1) return this;
    else if (this.eq("0") && n !== 0) return new Decimal("0");
    else {
      var z = new Decimal(this._value, this._decimals);
      //5300000
      //28090000000000
      //148877000000000000000
      for (let i = 1; i < n; i++) {
        z = z.mul(this);
      }
      return z;
    }
  }
}
