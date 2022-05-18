import { BlockchainName } from './config-types'
import { TokenName } from './token-types'

export type HardhatPodStarted = {
  BlockchainName: BlockchainName
  dateUtc: string
}

export type ITokenName = {
  TokenName: TokenName
}

export type RequestStatus = 'pending' | 'rejected' | 'resolved'
