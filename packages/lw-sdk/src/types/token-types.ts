export enum TokenName {
  USDC = 'USDC',
  USDT = 'USDT',
  WETH = 'WETH',
  DAI = 'DAI',
}

export const tokenDecimals: Record<TokenName, 6 | 18> = {
  [TokenName.USDC]: 6,
  [TokenName.USDT]: 6,
  [TokenName.WETH]: 18,
  [TokenName.DAI]: 6,
}
