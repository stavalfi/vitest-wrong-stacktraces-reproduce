import { NestFactory } from '@nestjs/core'
import { WsAdapter } from '@nestjs/platform-ws'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Logger } from 'winston'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { ValidationPipe, ArgumentMetadata, BadRequestException } from '@nestjs/common'
import { AppEnv, Config } from './config'
import { CustomError, ErrorKind } from '@coti-cvi/lw-sdk'
import fs from 'fs'
import path from 'path'

class CustomValidationPipe extends ValidationPipe {
  public async transform(requestBody: unknown, metadata: ArgumentMetadata) {
    try {
      return super.transform(requestBody, metadata)
    } catch (validationError: unknown) {
      if (validationError instanceof BadRequestException) {
        throw new CustomError({
          name: validationError.name,
          errorKind: ErrorKind.UserError,
          httpStatus: validationError.getStatus(),
          message: validationError.message,
          extras: {
            requestBody,
            // @ts-ignore
            requestBodyValidationErrors: validationError.getResponse().message,
          },
        })
      }
      throw validationError
    }
  }
}

export async function initializeNestService(options: { AppModule: unknown } | { app: NestFastifyApplication }) {
  const app =
    'AppModule' in options
      ? await NestFactory.create<NestFastifyApplication>(options.AppModule, new FastifyAdapter())
      : options.app

  const logger = app.get<Logger>(WINSTON_MODULE_PROVIDER)
  app.useLogger(logger)
  app.enableCors()

  app.useGlobalPipes(
    new CustomValidationPipe({
      forbidUnknownValues: true,
      enableDebugMessages: true,
      // --start--
      // throw an error if we pass params that do not exist in the dto: https://github.com/typestack/class-validator/issues/305#issuecomment-466126314
      whitelist: true,
      forbidNonWhitelisted: true,
      // --end--
    }),
  )
  app.useWebSocketAdapter(new WsAdapter(app))

  app.enableShutdownHooks()

  const config = app.get<Config>('ConfigToken')

  // vitest crush because of the swagger. it doesn't matter because we don't need swagger in tests anyways.
  if (!config.isTestMode) {
    const document = SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setDescription(
          config.appEnv == AppEnv.K8s
            ? `The ${config.runningService.name}@${config.appEnv}@${config.runningService.version} API documentation`
            : `The ${config.runningService.name}@${config.appEnv} API documentation`,
        )
        .setVersion('1.0')
        .build(),
    )

    await fs.promises.writeFile(
      path.join(
        config.repoPath,
        'packages',
        'auto-generated-code',
        'src',
        'backend-swaggers',
        `${config.runningService.name}-swagger.json`,
      ),
      JSON.stringify(document, null, 2),
    )

    const swaggerUrl = `api/docs`
    SwaggerModule.setup(swaggerUrl, app, document)

    logger.info(`swagger-api docs: ${config.runningService.accessibleBaseUrl}/${swaggerUrl}`)
  }

  const port = config.ports[config.runningService.name]

  await app.listen(port, '0.0.0.0')

  logger.info(`Listening on port ${port}`)
}
