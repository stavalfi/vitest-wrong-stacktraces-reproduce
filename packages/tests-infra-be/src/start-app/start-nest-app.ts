import { AppEnv, createConfig, getPackageJson, initializeNestService, ServiceName } from '@coti-cvi/common-be'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { Test } from '@nestjs/testing'
import ErrorStackParser from 'error-stack-parser'
import { CleanupFunction, StartNestAppOptions, TestApp } from '../types'
import getPort from 'get-port'
import path from 'path'
import { DataSource } from 'typeorm'
import findUp from 'find-up'
import { beforeEach } from 'vitest'

class StartNestAppGenerator {
  private readonly repoPath = path.dirname(findUp.sync('yarn.lock', { cwd: __dirname })!)

  constructor(private readonly appCleanups: CleanupFunction[]) {}

  public async start(
    options: StartNestAppOptions & { mysql: true },
  ): Promise<TestApp & { resources: { mysql: DataSource } }>

  public async start(options: StartNestAppOptions & { mysql?: false }): Promise<TestApp & { resources: {} }>

  public async start(options: StartNestAppOptions): Promise<TestApp & { resources: {} }> {
    const config = await createConfig({
      processEnv: {
        APP_ENV: AppEnv.Local,
        IS_TEST_MODE: 'true',
      },
      runningServiceName: ((): ServiceName => {
        const stackrtrace = ErrorStackParser.parse(new Error())
        const packageTested = stackrtrace
          .map(s => s.fileName)
          .find(s => s?.includes('.spec.ts'))
          ?.replace('async', '')
          .trim()
        if (!packageTested) {
          throw new Error('package tested not found in stack trace')
        }
        return getPackageJson(packageTested).name as ServiceName
      })(),
      overrideConfig: async config => {
        config.ports[config.runningService.name] = await getPort()
        config.mysql = {
          username: 'root',
          password: 'my-secret-pw',
          host: 'localhost',
          port: 3306,
          database: 'db1',
          entities: config.mysql.entities,
          migrations: [path.join(__dirname, '../resources/mysql-migrations/**/*')],
        }
      },
    })

    if (options.beforeStart) {
      await options.beforeStart({ config })
    }

    const testingModuleBuilder = Test.createTestingModule({
      imports: [options.mainNestModule],
    })
      .overrideProvider('ProcessEnvToken')
      .useValue(config.processEnv)
      .overrideProvider('ConfigToken')
      .useValue(config)

    const withMocks = options.replaceWithMock ? options.replaceWithMock(testingModuleBuilder) : testingModuleBuilder

    const moduleRef = await withMocks.compile()

    const app = await moduleRef.createNestApplication<NestFastifyApplication>(new FastifyAdapter())

    await initializeNestService({ app })

    let isAppOpen = true

    this.appCleanups.push(async () => {
      if (isAppOpen) {
        isAppOpen = false
        await app.close()
      }
    })

    return {
      app,
      moduleRef,
      resources: {},
      httpServer: app.getHttpServer(),
      config,
      closeApp: async () => {
        if (isAppOpen) {
          isAppOpen = false
          await app.close()
        } else {
          throw new Error("app already closed. can't close it. you have a bug in your test")
        }
      },
    }
  }
}

export function nestAppBeforeAfterEach(connectionsCleanups: CleanupFunction[]) {
  const appCleanups: CleanupFunction[] = []
  const startNestAppGenerator = new StartNestAppGenerator(appCleanups)

  beforeEach(() => {
    // empty array without changing it's internal pointer
    appCleanups.splice(0, appCleanups.length)

    connectionsCleanups.push(async () => {
      const results = await Promise.allSettled(appCleanups.map(func => func()))
      if (results.some(r => r.status === 'rejected')) {
        console.group('end-test-errors')
        for (const r of results) {
          if (r.status === 'rejected') {
            console.error(r.reason)
          }
        }
        console.groupEnd()
        throw new Error(`test could not complete successfully`)
      }
    })
  })

  return startNestAppGenerator.start.bind(startNestAppGenerator)
}
