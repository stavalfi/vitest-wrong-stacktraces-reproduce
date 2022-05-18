import { TokenName } from '../types'

export type InteractableTokenName = TokenName.USDC

export type TokenData = {
  name: InteractableTokenName
  symbol: string
  decimals: number
}

export const interactableTokens: { [tokenName in InteractableTokenName]: TokenData } = {
  [TokenName.USDC]: {
    name: TokenName.USDC,
    symbol: TokenName.USDC,
    decimals: 6,
  },
}
