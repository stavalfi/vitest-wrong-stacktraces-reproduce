import { betterAjvErrors } from '@apideck/better-ajv-errors'
import Ajv from 'ajv'
import path from 'path'
import fs from 'fs'
import execa from 'execa'
import os from 'os'
import { Module } from '@nestjs/common'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Logger } from 'winston'
import findUp from 'find-up'
import { configSchema } from './schemas'
import { AppEnv, Config, ManuallyDefinedConfig, ServiceName as MicroServiceName } from './types'
import { CustomError, ErrorKind } from '@coti-cvi/lw-sdk'
import { defineConfig } from './define-config'

export async function getBranchName({
  repoPath,
  env,
}: {
  repoPath: string
  env: Omit<NodeJS.ProcessEnv, 'NODE_ENV'>
}): Promise<string> {
  if (env.GITHUB_REF_NAME === 'main') {
    return 'main'
  }
  const branch = env.CODEBUILD_WEBHOOK_TRIGGER?.replace('branch/', '')
  if (branch) {
    return branch
  }
  return execa
    .command('git branch --show-current', {
      stdio: 'pipe',
      cwd: repoPath,
    })
    .then(r => r.stdout)
}

export async function createConfig({
  runningServiceName,
  processEnv,
  overrideConfig,
}: {
  runningServiceName: MicroServiceName
  processEnv: Omit<NodeJS.ProcessEnv, 'NODE_ENV'>
  overrideConfig?: (config: Config) => void | Promise<void>
}): Promise<Config> {
  const unfinishedTaskPromise = (async () => {
    throw new Error('stav2')
  })()
  const repoPath = path.dirname((await findUp('yarn.lock', { cwd: __dirname }))!)

  const dockerImageVersionPath = path.join(repoPath, 'image_version')
  const isDockerImageVersionExist = fs.existsSync(dockerImageVersionPath)
  const serviceVersion = 'a'

  const appEnv = (processEnv.APP_ENV ?? AppEnv.Local) as AppEnv

  if (!Object.values(AppEnv).includes(appEnv)) {
    throw new Error(`APP_ENV is illegal. allowed values are: ${Object.values(AppEnv)}`)
  }

  const definedConfig = defineConfig(processEnv)

  const partialConfig: ManuallyDefinedConfig = {} as ManuallyDefinedConfig

  for (const [key, value] of Object.entries(definedConfig)) {
    const valueToUse = typeof value !== 'object' || !(AppEnv.K8s in value) ? value : value[appEnv]
    Object.defineProperty(partialConfig, key, { value: valueToUse, enumerable: true })
  }

  const replicaId = os.hostname()

  let accessibleBaseUrl: string

  switch (appEnv) {
    case AppEnv.Local:
      accessibleBaseUrl = `http://localhost:${partialConfig.ports[runningServiceName]}`
      break
    case AppEnv.K8s:
      accessibleBaseUrl = `https://${runningServiceName}.dev-cvi-finance-route53.com`
      break
    default:
      throw new Error(`APP_ENV is illegal. allowed values are: ${Object.values(AppEnv)}`)
  }

  const config: Config = {
    ...partialConfig,
    repoPath,
    appEnv,
    processEnv,
    isTestMode: Boolean(processEnv.IS_TEST_MODE),
    runningService: {
      name: runningServiceName,
      replicaId,
      accessibleBaseUrl,
      version: serviceVersion,
    },
  }

  if (overrideConfig) {
    await overrideConfig(config)
  }

  const ajv = new Ajv({ allErrors: true, coerceTypes: false, useDefaults: false, allowUnionTypes: true })
  const validate = ajv.compile(configSchema)
  if (!validate(config)) {
    const error = new CustomError({
      name: 'config-error',
      errorKind: ErrorKind.SystemError,
      message: 'failed to validate config',
      extras: {
        actualAjvErrorMessage: betterAjvErrors({
          errors: validate.errors,
          data: config,
          // @ts-ignore
          schema: configSchema,
        }),
        config,
      },
    })
    // we manually print the error because sentry may not initialize it at this point in time
    CustomError.printErrorToConsole(error)
    throw error
  }

  return config
}

@Module({
  providers: [
    {
      provide: 'ProcessEnvToken',
      useFactory: () => process.env,
    },
    {
      provide: 'ConfigToken',
      useFactory: async (
        runningServiceName: MicroServiceName,
        processEnv: Omit<NodeJS.ProcessEnv, 'NODE_ENV'>,
        logger: Logger,
      ): Promise<Config> => {
        const config = await createConfig({ runningServiceName, processEnv })
        logger.info(
          `${config.runningService.name}@${config.runningService.version} - appEnv=${config.appEnv} - ${config.runningService.accessibleBaseUrl} - replica-id: ${config.runningService.replicaId}`,
        )
        return config
      },
      inject: ['ServiceNameToken', 'ProcessEnvToken', WINSTON_MODULE_PROVIDER],
    },
  ],
  exports: ['ConfigToken'],
})
export class ConfigModule {}
