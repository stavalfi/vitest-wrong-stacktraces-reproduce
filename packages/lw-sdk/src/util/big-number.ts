import { BigNumber, BigNumberish, ethers } from 'ethers'
// @ts-ignore
import kConvert from 'k-convert'

const toKNumber = (num: number): string => (num >= 0 ? kConvert.convertTo(num) : `-${kConvert.convertTo(-1 * num)}`)

export function toSignificantDigits(number: string, significantDigits: number): string {
  const [whole, fraction] = number.split('.')
  if (fraction.length <= significantDigits) {
    return number
  }
  return `${whole}.${fraction.substring(0, significantDigits)}`
}

export type BigNumberCovertOptionalOptions = {
  significantDigits?: number // how much digits to keep after the decimal point
} & (
  | {
      commify: true // should transform 1000000 to 1,000,000
    }
  | {
      kCovert: true // should transform 1000 to 1k, 1000000 to 1000k, -1000 to -1k
    }
  | {}
)

export const bigNumberToString = (
  amount: BigNumberish,
  options: {
    magnitude: number // how much to devide the BigNumber when converting to Number (example: 6 ==> BigNumber/1,000,000)
  } & BigNumberCovertOptionalOptions,
): string => {
  const n = ethers.utils.formatUnits(amount, options.magnitude)
  const numberAsString = toSignificantDigits(n, options.significantDigits ?? 2)
  if ('commify' in options) {
    return ethers.utils.commify(numberAsString)
  } else if ('kCovert' in options) {
    return toKNumber(Number(numberAsString))
  }
  return numberAsString
}

export const toCviIndexNumber = (contractEventCviValue: BigNumber, options?: BigNumberCovertOptionalOptions): string =>
  bigNumberToString(contractEventCviValue, {
    ...options,
    magnitude: 2,
  })

export const toUsdcNumber = (contractEventUsdcValue: BigNumber, options?: BigNumberCovertOptionalOptions): string =>
  bigNumberToString(contractEventUsdcValue, {
    ...options,
    magnitude: 6,
  })

export const toPositionUnitsAmountNumber = (
  contractEventPositionUnitsAmountValue: BigNumber,
  options?: BigNumberCovertOptionalOptions,
): string =>
  bigNumberToString(contractEventPositionUnitsAmountValue, {
    ...options,
    magnitude: 6,
  })

export function sumBigNumber(args: BigNumberish[]): BigNumber {
  return args.reduce((acc: BigNumber, curr: BigNumberish) => acc.add(curr), BigNumber.from(0))
}

export function roundCryptoValueString(str: string, decimalPlaces = 18) {
  if (!str.includes('.')) {
    return str
  }
  const [whole, fraction] = str.split('.')
  return `${whole}.${fraction.substring(0, decimalPlaces)}`
}

export const toBN = (amount: BigNumberish, decimals = 0): BigNumber => {
  const amountString = amount.toString().startsWith('0x') ? BigNumber.from(amount).toString() : amount.toString()
  return ethers.utils.parseUnits(roundCryptoValueString(amountString, decimals), decimals)
}

export const fromBN = (amount: BigNumber, decimals = 0): number => {
  return +ethers.utils.formatUnits(amount, decimals)
}

export const toHex = (amount: BigNumberish, decimals = 0): string => {
  return toBN(amount, decimals).toHexString().replace(/0x0+/, '0x')
}

export const isNum = (num: string): boolean => {
  return num === null || num === undefined || num.length === 0 || isNaN(+num)
}
