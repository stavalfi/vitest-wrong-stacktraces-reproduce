export enum NetworkName {
  Staging = 'staging',
  Mainnet = 'live',
  Local = 'dev',
}

export enum BlockchainName {
  ETHEREUM = 'ethereum',
  POLYGON = 'polygon',
  ARBITRUM = 'arbitrum',
}

export type TheGraphGraph = 'platformGraph'

export type BackendInversifyConfig = {
  zapper: {
    zapperApiKey: string
    proxy?: { host: string; port: number; auth?: { username: string; password: string } }
  }
  isTestMode: boolean
}

export enum ChainId {
  EthereumMainnet = 1,
  PolygonMainnet = 137,
  ArbitrumMainnet = 42161,
  EthereumStaging = 31337,
  PolygonStaging = 31338,
  ArbitrumStaging = 31339,
  EthereumLocal = 31137,
  PolygonLocal = 31138,
  ArbitrumLocal = 31139,
}

export type ChainsInfo = {
  [ChainId.EthereumMainnet]: {
    hardhatConfigNetworkName: 'EthereumMainnet'
    networkName: NetworkName.Mainnet
    chainId: ChainId.EthereumMainnet
    blockchainName: BlockchainName.ETHEREUM
    nativeCurrency: {
      name: BlockchainName.ETHEREUM
      symbol: 'ETH'
      decimals: 18
    }
    cviRpcUrl: string
    deployAndForkRpcUrl: string
    blockExplorerUrl: string
    forkContractsNetworkName?: undefined
  }
  [ChainId.PolygonMainnet]: {
    hardhatConfigNetworkName: 'PolygonMainnet'
    networkName: NetworkName.Mainnet
    chainId: ChainId.PolygonMainnet
    blockchainName: BlockchainName.POLYGON
    nativeCurrency: {
      name: 'Matic'
      symbol: 'MATIC'
      decimals: 18
    }
    cviRpcUrl: string
    deployAndForkRpcUrl: string
    blockExplorerUrl: string
    forkContractsNetworkName?: undefined
  }
  [ChainId.ArbitrumMainnet]: {
    hardhatConfigNetworkName: 'ArbitrumMainnet'
    networkName: NetworkName.Mainnet
    chainId: ChainId.ArbitrumMainnet
    blockchainName: BlockchainName.ARBITRUM
    nativeCurrency: {
      name: 'ETH'
      symbol: 'ETH'
      decimals: 18
    }
    cviRpcUrl: string
    deployAndForkRpcUrl: string
    blockExplorerUrl: string
    forkContractsNetworkName?: undefined
  }
  [ChainId.EthereumStaging]: {
    hardhatConfigNetworkName: 'EthereumStaging'
    networkName: NetworkName.Staging
    chainId: ChainId.EthereumStaging
    blockchainName: BlockchainName.ETHEREUM
    nativeCurrency: {
      name: BlockchainName.ETHEREUM
      symbol: 'ETH'
      decimals: 18
    }
    cviRpcUrl: string
    deployAndForkRpcUrl: string
    blockExplorerUrl: undefined
    forkContractsNetworkName: 'EthereumMainnet'
  }
  [ChainId.PolygonStaging]: {
    hardhatConfigNetworkName: 'PolygonStaging'
    networkName: NetworkName.Staging
    chainId: ChainId.PolygonStaging
    blockchainName: BlockchainName.POLYGON
    nativeCurrency: {
      name: 'Matic'
      symbol: 'MATIC'
      decimals: 18
    }
    cviRpcUrl: string
    deployAndForkRpcUrl: string
    blockExplorerUrl: string
    forkContractsNetworkName: 'PolygonMainnet'
  }
  [ChainId.ArbitrumStaging]: {
    hardhatConfigNetworkName: 'ArbitrumStaging'
    networkName: NetworkName.Staging
    chainId: ChainId.ArbitrumStaging
    blockchainName: BlockchainName.ARBITRUM
    nativeCurrency: {
      name: 'ETH'
      symbol: 'ETH'
      decimals: 18
    }
    cviRpcUrl: string
    deployAndForkRpcUrl: string
    blockExplorerUrl: string
    forkContractsNetworkName: 'ArbitrumMainnet'
  }
  [ChainId.EthereumLocal]: {
    hardhatConfigNetworkName: 'EthereumLocal'
    networkName: NetworkName.Local
    chainId: ChainId.EthereumLocal
    blockchainName: BlockchainName.ETHEREUM
    nativeCurrency: {
      name: BlockchainName.ETHEREUM
      symbol: 'ETH'
      decimals: 18
    }
    cviRpcUrl: string
    deployAndForkRpcUrl: string
    blockExplorerUrl: undefined
    forkContractsNetworkName: 'EthereumMainnet'
  }
  [ChainId.PolygonLocal]: {
    hardhatConfigNetworkName: 'PolygonLocal'
    networkName: NetworkName.Local
    chainId: ChainId.PolygonLocal
    blockchainName: BlockchainName.POLYGON
    nativeCurrency: {
      name: 'Matic'
      symbol: 'MATIC'
      decimals: 18
    }
    cviRpcUrl: string
    deployAndForkRpcUrl: string
    blockExplorerUrl: undefined
    forkContractsNetworkName: 'PolygonMainnet'
  }
  [ChainId.ArbitrumLocal]: {
    hardhatConfigNetworkName: 'ArbitrumLocal'
    networkName: NetworkName.Local
    chainId: ChainId.ArbitrumLocal
    blockchainName: BlockchainName.ARBITRUM
    nativeCurrency: {
      name: 'ETH'
      symbol: 'ETH'
      decimals: 18
    }
    cviRpcUrl: string
    deployAndForkRpcUrl: string
    blockExplorerUrl: undefined
    forkContractsNetworkName: 'ArbitrumMainnet'
  }
}

export type ChainInfo = ChainsInfo[ChainId]

export const CHAIN_IDS_INFO: ChainsInfo = {
  [ChainId.EthereumMainnet]: {
    hardhatConfigNetworkName: 'EthereumMainnet',
    networkName: NetworkName.Mainnet,
    chainId: ChainId.EthereumMainnet,
    blockchainName: BlockchainName.ETHEREUM,
    nativeCurrency: {
      name: BlockchainName.ETHEREUM,
      symbol: 'ETH',
      decimals: 18,
    },
    cviRpcUrl: 'https://eth-mainnet.alchemyapi.io/v2/3zmqQxd6utskAgFMtccVwbVVqwFkDPew',
    deployAndForkRpcUrl: 'https://eth-mainnet.alchemyapi.io/v2/3zmqQxd6utskAgFMtccVwbVVqwFkDPew',
    blockExplorerUrl: 'https://etherscan.com',
  },
  [ChainId.PolygonMainnet]: {
    hardhatConfigNetworkName: 'PolygonMainnet',
    networkName: NetworkName.Mainnet,
    chainId: ChainId.PolygonMainnet,
    blockchainName: BlockchainName.POLYGON,
    nativeCurrency: {
      name: 'Matic',
      symbol: 'MATIC',
      decimals: 18,
    },
    cviRpcUrl: 'https://polygon-mainnet.g.alchemy.com/v2/nRwEMetaPps6KMDIuqhXn9t02xhO3H8_',
    deployAndForkRpcUrl: 'https://polygon-mainnet.g.alchemy.com/v2/nRwEMetaPps6KMDIuqhXn9t02xhO3H8_',
    blockExplorerUrl: 'https://explorer-mainnet.maticvigil.com',
  },
  [ChainId.ArbitrumMainnet]: {
    hardhatConfigNetworkName: 'ArbitrumMainnet',
    networkName: NetworkName.Mainnet,
    chainId: ChainId.ArbitrumMainnet,
    blockchainName: BlockchainName.ARBITRUM,
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
    cviRpcUrl: 'https://arb-mainnet.g.alchemy.com/v2/JWsTySIqztFhJrTkfqK_rv1y7Zl0j-HU',
    deployAndForkRpcUrl: 'https://arb-mainnet.g.alchemy.com/v2/JWsTySIqztFhJrTkfqK_rv1y7Zl0j-HU',
    blockExplorerUrl: 'https://arbiscan.io',
  },
  [ChainId.EthereumStaging]: {
    hardhatConfigNetworkName: 'EthereumStaging',
    networkName: NetworkName.Staging,
    chainId: ChainId.EthereumStaging,
    blockchainName: BlockchainName.ETHEREUM,
    nativeCurrency: {
      name: BlockchainName.ETHEREUM,
      symbol: 'ETH',
      decimals: 18,
    },
    cviRpcUrl: 'https://hardhat-ethereum.dev-cvi-finance-route53.com',
    deployAndForkRpcUrl: 'https://eth-mainnet.alchemyapi.io/v2/3zmqQxd6utskAgFMtccVwbVVqwFkDPew',
    blockExplorerUrl: undefined,
    forkContractsNetworkName: 'EthereumMainnet',
  },
  [ChainId.PolygonStaging]: {
    hardhatConfigNetworkName: 'PolygonStaging',
    networkName: NetworkName.Staging,
    chainId: ChainId.PolygonStaging,
    blockchainName: BlockchainName.POLYGON,
    nativeCurrency: {
      name: 'Matic',
      symbol: 'MATIC',
      decimals: 18,
    },
    cviRpcUrl: 'https://hardhat-polygon.dev-cvi-finance-route53.com',
    deployAndForkRpcUrl: 'https://polygon-mainnet.g.alchemy.com/v2/nRwEMetaPps6KMDIuqhXn9t02xhO3H8_',
    blockExplorerUrl: 'https://matic.network',
    forkContractsNetworkName: 'PolygonMainnet',
  },
  [ChainId.ArbitrumStaging]: {
    hardhatConfigNetworkName: 'ArbitrumStaging',
    networkName: NetworkName.Staging,
    chainId: ChainId.ArbitrumStaging,
    blockchainName: BlockchainName.ARBITRUM,
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
    cviRpcUrl: 'https://hardhat-arbitrum.dev-cvi-finance-route53.com',
    deployAndForkRpcUrl: 'https://arb-mainnet.g.alchemy.com/v2/JWsTySIqztFhJrTkfqK_rv1y7Zl0j-HU',
    blockExplorerUrl: 'https://arbiscan.io',
    forkContractsNetworkName: 'ArbitrumMainnet',
  },
  [ChainId.EthereumLocal]: {
    hardhatConfigNetworkName: 'EthereumLocal',
    networkName: NetworkName.Local,
    chainId: ChainId.EthereumLocal,
    blockchainName: BlockchainName.ETHEREUM,
    nativeCurrency: {
      name: BlockchainName.ETHEREUM,
      symbol: 'ETH',
      decimals: 18,
    },
    cviRpcUrl: 'http://localhost:8545',
    deployAndForkRpcUrl: 'https://eth-mainnet.alchemyapi.io/v2/3zmqQxd6utskAgFMtccVwbVVqwFkDPew',
    blockExplorerUrl: undefined,
    forkContractsNetworkName: 'EthereumMainnet',
  },
  [ChainId.PolygonLocal]: {
    hardhatConfigNetworkName: 'PolygonLocal',
    networkName: NetworkName.Local,
    chainId: ChainId.PolygonLocal,
    blockchainName: BlockchainName.POLYGON,
    nativeCurrency: {
      name: 'Matic',
      symbol: 'MATIC',
      decimals: 18,
    },
    cviRpcUrl: 'http://localhost:8546',
    deployAndForkRpcUrl: 'https://polygon-mainnet.g.alchemy.com/v2/nRwEMetaPps6KMDIuqhXn9t02xhO3H8_',
    blockExplorerUrl: undefined,
    forkContractsNetworkName: 'PolygonMainnet',
  },
  [ChainId.ArbitrumLocal]: {
    hardhatConfigNetworkName: 'ArbitrumLocal',
    networkName: NetworkName.Local,
    chainId: ChainId.ArbitrumLocal,
    blockchainName: BlockchainName.ARBITRUM,
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
    cviRpcUrl: 'http://localhost:8547',
    deployAndForkRpcUrl: 'https://arb-mainnet.g.alchemy.com/v2/JWsTySIqztFhJrTkfqK_rv1y7Zl0j-HU',
    blockExplorerUrl: undefined,
    forkContractsNetworkName: 'ArbitrumMainnet',
  },
}
