import axios from 'axios'
import * as hrtime from 'browser-hrtime'
import { TokenName } from './types'

// timer in seconds with a precision of nano-seconds. output example: 0.000168734 seconds
export const startTimer = () => {
  const start = hrtime.default()
  return () => {
    const end = hrtime.default(start)
    return end[0] + end[1] / 1e9
  }
}

export const theGraphUrls = {
  cvi: {
    polygon: {
      platform: 'https://api.thegraph.com/subgraphs/name/vladi-coti/polygon-platforms',
    },
  },
  uniswap: {
    graph: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2',
  },
}

export function isTokenFormatAsFiat(token: TokenName): boolean {
  return (
    token.toUpperCase() === TokenName.USDC ||
    token.toUpperCase() === TokenName.USDT ||
    token.toUpperCase() === TokenName.DAI
  )
}
export function amountFormatInFiat(num: number): number {
  return Number((Math.round(num * 100) / 100).toFixed(2))
}

// https://stackoverflow.com/a/175787/806963
export function isNumeric(str?: unknown): boolean {
  return (
    str !== null &&
    str !== undefined &&
    // @ts-expect-error
    !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str as string)) // ...and ensure strings of whitespace fail
  )
}

export function getDateNowSeconds(): number {
  return Math.floor(Date.now() / 1000)
}

export function tokenToPositionUnitsAmount({ tokens, index }: { tokens: number; index: number }): number {
  return tokens * (200 / index)
}

export function positionUnitsAmountToToken({
  positionUnitsAmount,
  index,
}: {
  positionUnitsAmount: number
  index: number
}): number {
  return positionUnitsAmount * (index / 200)
}

export async function getCurrentCviIndex(): Promise<number> {
  const result = await axios.get<{
    status: 'Success' | string
    data: {
      CVI: {
        timestamp: number
        index: number
        oneDayChange: number
        oneDayChangePercent: number
        oneHourAgo: number
        oneWeekHigh: number
        oneWeekLow: number
      }
      ETHVOL: {
        timestamp: number
        index: number
        oneDayChange: number
        oneDayChangePercent: number
        oneHourAgo: number
        oneWeekHigh: number
        oneWeekLow: number
      }
    }
  }>('https://api-v2.cvi.finance/latest')

  return result.data.data.CVI.index
}
