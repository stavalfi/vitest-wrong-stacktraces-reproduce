import { BlockchainName, TokenName } from './types'

type ContractAddresses = {
  [BlockchainName.ETHEREUM]: {
    tokens: Record<TokenName, string>
    pairs: {
      token0: TokenName
      token1: TokenName
      contractAddress: string
      buyIlProtectionEnabledForPair: boolean
    }[]
  }
}

export const CONTRACT_ADDRESSES: ContractAddresses = {
  [BlockchainName.ETHEREUM]: {
    tokens: {
      [TokenName.DAI]: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
      [TokenName.USDC]: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      [TokenName.USDT]: '0xDAC17F958D2ee523a2206206994597C13D831ec7',
      [TokenName.WETH]: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    },
    pairs: [
      {
        token0: TokenName.USDC,
        token1: TokenName.WETH,
        contractAddress: '0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc',
        buyIlProtectionEnabledForPair: true,
      },
      {
        token0: TokenName.USDT,
        token1: TokenName.WETH,
        contractAddress: '0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852',
        buyIlProtectionEnabledForPair: true,
      },
      {
        token0: TokenName.DAI,
        token1: TokenName.WETH,
        contractAddress: '0xa478c2975ab1ea89e8196811f51a7b7ade33eb11',
        buyIlProtectionEnabledForPair: true,
      },
    ],
  },
}
