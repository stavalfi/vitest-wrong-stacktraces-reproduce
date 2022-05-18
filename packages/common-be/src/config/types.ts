import type { ChainId, TokenName } from '@coti-cvi/lw-sdk'
import type { DataSourceOptions } from 'typeorm'

export const SERVICE_NAMES = ['data-feed', 'il-backend', 'il-monitor'] as const // package.json name
export type ServiceName = typeof SERVICE_NAMES[number]

export enum AppEnv {
  Local = 'local',
  K8s = 'k8s',
}

export type Config = {
  repoPath: string
  processEnv: Omit<NodeJS.ProcessEnv, 'NODE_ENV'>
  runningService: {
    name: ServiceName
    version: string
    replicaId: string
    accessibleBaseUrl: string
  }
  k8sConfigBase64: string
  appEnv: AppEnv
  isTestMode: boolean
  ports: Record<ServiceName, number>
  ilMonitoring: {
    runKeepersBotOnChainId: ChainId
  }
  sentry: {
    enabled: boolean
    dsn: Record<ServiceName, string>
  }
  mysql: {
    username: string
    password: string
    host: string
    port: number
    database: string
  } & Required<Pick<DataSourceOptions, 'entities'>> &
    Partial<Pick<DataSourceOptions, 'migrations'>>
  zapper: {
    zapperApiKey: string
    proxy?: { host: string; port: number; auth?: { username: string; password: string } }
  }
  ilBackend: {
    calcMaxIlBasedOnXSecondsAgo: number
    supportedPairContracts: {
      token0: TokenName
      token1: TokenName
      contractAddress: string
      buyIlProtectionEnabledForPair: boolean
    }[]
  }
}

export type ManuallyDefinedConfig = Omit<Config, 'repoPath' | 'processEnv' | 'isTestMode' | 'runningService' | 'appEnv'>

export type DefineConfigReturnType = {
  [ConfigKey in keyof ManuallyDefinedConfig]:
    | ManuallyDefinedConfig[ConfigKey]
    | {
        [AppEnv.K8s]: ManuallyDefinedConfig[ConfigKey]
        [AppEnv.Local]: ManuallyDefinedConfig[ConfigKey]
      }
}
