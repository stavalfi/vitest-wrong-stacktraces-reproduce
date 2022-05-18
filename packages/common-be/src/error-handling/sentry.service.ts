import { Inject } from '@nestjs/common'
import { NodeClient, Scope } from '@sentry/node'
import _ from 'lodash'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import type { Logger } from 'winston'
import { Config } from '../config'
import { CustomError, ErrorKind } from '@coti-cvi/lw-sdk'

export class SentryService {
  private readonly sentryClient: NodeClient

  private readonly sentryTags: Record<string, string> = {}

  private readonly sentryExtras: Record<string, unknown> = {}

  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @Inject('ConfigToken') private readonly config: Config,
  ) {
    const dsn = this.config.sentry.dsn[config.runningService.name]
    const projectId = dsn.split('/')[dsn.split('/').length - 1] // https://<abc>@<efg>.ingest.sentry.io/<**project-id***>
    this.sentryClient = new NodeClient({
      dsn,
      release: config.runningService.version,
      environment: config.appEnv,
      enabled: this.config.sentry.enabled,
      beforeSend: async event => {
        this.logger.error(`
An error was captured by sentry. Go to the link: "https://sentry.io/organizations/cvi/issues/?project=${projectId}&query=${event.event_id}".\
`)
        return event
      },
    })

    // the following section handles edge-case where there is an unhandled exception (in test/dev/prod)
    // and in this case, no-one is fully-printing all the customError properties.
    process.on('uncaughtException', error => CustomError.printErrorToConsole(error))
    process.on('uncaughtExceptionMonitor', error => CustomError.printErrorToConsole(error))
    process.on('unhandledRejection', (error: Error | CustomError) => CustomError.printErrorToConsole(error))

    this.logger.info(`initialized sentry - isSentryEnabled: ${this.config.sentry.enabled}`)

    this.sentryTags.runningServiceName = this.config.runningService.name
    this.sentryTags.runningServiceBaseUrl = this.config.runningService.accessibleBaseUrl
  }

  public addTag(tagKey: string, tagValue: string): void {
    this.sentryTags[tagKey] = tagValue
  }

  public sendErrorToSentry(error: Error | CustomError): void {
    const ignored = error instanceof CustomError && error.ignore
    if (!ignored && (!(error instanceof CustomError) || error.errorKind === ErrorKind.SystemError)) {
      if (this.config.sentry.enabled) {
        const sentryError = error instanceof CustomError ? error.getSentryError() : error
        const scope = new Scope()
        scope.setTags(this.sentryTags)

        scope.setExtras(this.sentryExtras)

        if (error instanceof CustomError) {
          scope.setExtras({
            message: error.message,
            ..._.mapValues(error.extras, value => JSON.stringify(value, null, 2)),
            ...(error.causeOfError ? { cause: error.causeOfError } : {}),
            config: JSON.stringify(this.config, null, 2),
          })
          scope.setTag('errorKind', error.errorKind)
        }

        this.sentryClient.captureException(sentryError, undefined, scope)
      } else {
        if (error instanceof CustomError) {
          this.logger.error('It seems that sentry is disabled. Skipping sending the following error to sentry:')
        }
      }
    }
    CustomError.printErrorToConsole(error, {
      defaultSentryTags: this.sentryTags,
      defaultSentryExtras: this.sentryExtras,
    })
  }
}
