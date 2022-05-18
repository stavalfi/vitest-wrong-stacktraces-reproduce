import { JSONSchemaType } from 'ajv'
import { ChainId, TokenName } from '@coti-cvi/lw-sdk'
import { getEnumValues } from '../utils'
import { AppEnv, Config, SERVICE_NAMES } from './types'

export const configSchema: JSONSchemaType<Config> = {
  type: 'object',
  properties: {
    repoPath: { type: 'string' },
    processEnv: { type: 'object', additionalProperties: { type: 'string' }, required: [] },
    appEnv: {
      type: 'string',
      enum: getEnumValues(AppEnv),
    },
    ilMonitoring: {
      type: 'object',
      properties: {
        runKeepersBotOnChainId: {
          type: 'number',
          enum: getEnumValues(ChainId),
        },
      },
      required: ['runKeepersBotOnChainId'],
      additionalProperties: false,
    },
    zapper: {
      type: 'object',
      properties: {
        zapperApiKey: { type: 'string' },
        proxy: {
          type: 'object',
          nullable: true,
          properties: {
            host: { type: 'string' },
            port: { type: 'number' },
            auth: {
              type: 'object',
              nullable: true,
              properties: {
                username: { type: 'string' },
                password: { type: 'string' },
              },
              additionalProperties: false,
              required: ['username', 'password'],
            },
          },
          additionalProperties: true,
          required: ['host', 'port'],
        },
      },
      additionalProperties: true,
      required: ['zapperApiKey'],
    },
    isTestMode: {
      type: 'boolean',
    },
    k8sConfigBase64: {
      type: 'string',
    },
    ilBackend: {
      type: 'object',
      properties: {
        calcMaxIlBasedOnXSecondsAgo: { type: 'number' },
        supportedPairContracts: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              token0: { type: 'string', enum: getEnumValues(TokenName) },
              token1: { type: 'string', enum: getEnumValues(TokenName) },
              contractAddress: { type: 'string' },
              buyIlProtectionEnabledForPair: { type: 'boolean' },
            },
            additionalProperties: false,
            required: ['contractAddress', 'token0', 'token1', 'buyIlProtectionEnabledForPair'],
          },
        },
      },
      additionalProperties: false,
      required: ['calcMaxIlBasedOnXSecondsAgo', 'supportedPairContracts'],
    },
    runningService: {
      type: 'object',
      properties: {
        name: { type: 'string', enum: SERVICE_NAMES },
        version: { type: 'string' },
        accessibleBaseUrl: { type: 'string' },
        replicaId: { type: 'string' },
      },
      additionalProperties: false,
      required: ['name', 'version', 'accessibleBaseUrl', 'replicaId'],
    },
    mysql: {
      type: 'object',
      properties: {
        username: { type: 'string' },
        password: { type: 'string' },
        host: { type: 'string' },
        port: { type: 'number' },
        database: { type: 'string' },
        entities: { type: 'array', items: { type: 'string' } },
        migrations: { type: 'array', items: { type: 'string' }, nullable: true },
      },
      additionalProperties: false,
      required: ['username', 'password', 'host', 'port', 'database', 'entities'],
    },
    ports: {
      type: 'object',
      properties: {
        'data-feed': { type: 'number' },
        'il-backend': { type: 'number' },
        'il-monitor': { type: 'number' },
      },
      additionalProperties: false,
      required: ['data-feed', 'il-backend', 'il-monitor'],
    },
    sentry: {
      type: 'object',
      properties: {
        enabled: { type: 'boolean' },
        dsn: {
          type: 'object',
          properties: {
            'data-feed': { type: 'string' },
            'il-backend': { type: 'string' },
            'il-monitor': { type: 'string' },
          },
          additionalProperties: false,
          required: ['data-feed', 'il-backend', 'il-monitor'],
        },
      },
      additionalProperties: false,
      required: ['enabled', 'dsn'],
    },
  },
  additionalProperties: false,
  required: ['appEnv', 'k8sConfigBase64', 'isTestMode', 'zapper', 'ports', 'processEnv', 'runningService', 'sentry'],
}
