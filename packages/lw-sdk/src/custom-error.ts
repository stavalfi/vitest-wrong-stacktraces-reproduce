import { ValidationError } from 'class-validator'
import { StatusCodes } from 'http-status-codes'
import _ from 'lodash'

export enum ErrorKind {
  UserError = 'userError',
  SystemError = 'systemError',
}

type CustomErrorOptions = {
  name: string
  message: string
  cause?: unknown | Error | ValidationError[]
  ignore?: boolean
  extras?: Record<string, unknown>
} & (
  | {
      errorKind: ErrorKind.UserError
      httpStatus: StatusCodes
    }
  | {
      errorKind: ErrorKind.SystemError
      httpStatus?: StatusCodes
    }
)

export type IgnoredErrorDetails = { isIgnored: boolean }

export class CustomError extends Error {
  public readonly errorKind: ErrorKind

  public readonly httpStatus?: StatusCodes

  public readonly extras: Record<string, unknown> | undefined

  public readonly causeOfError?: unknown | Error | ValidationError[]

  public readonly ignore: boolean

  constructor(options: CustomErrorOptions) {
    super()
    if (options.cause && options.cause instanceof CustomError) {
      throw new Error(
        `the cause of the custom-error is already a custom error. there is no need to wrap it again inside additional custom-error: ${JSON.stringify(
          options,
          null,
          2,
        )}`,
      )
    }
    this.name = options.name
    this.message = options.message
    this.errorKind = options.errorKind
    this.httpStatus = options.httpStatus
    this.causeOfError = options.cause
    this.extras = options.extras
    this.ignore = Boolean(options.ignore)
  }

  getHttpException() {
    return {
      httpStatusCode: this.httpStatus ?? StatusCodes.INTERNAL_SERVER_ERROR,
      name: this.name,
      message: this.message,
      extras: this.extras,
    }
  }

  getSentryError(): Error {
    const sentryError = new Error()
    sentryError.name = this.name
    sentryError.stack = this.stack
    return sentryError
  }

  private static printNodeJsError(cause: unknown | Error | ValidationError | ValidationError[]): void {
    if (Array.isArray(cause)) {
      console.group()
      console.error(`${cause.length} errors:`)
      cause.forEach(error => {
        console.error('------------------------------')
        CustomError.printNodeJsError(error)
        console.error('------------------------------')
      })
      console.groupEnd()
      return
    }
    if (cause instanceof ValidationError) {
      console.error(cause)
    } else {
      console.group()
      // print the stacktrace seperatly to make it more human-readable
      // @ts-ignore
      console.error(cause.stack)
      // https://stackoverflow.com/a/43126303/806963
      console.error(
        JSON.stringify(
          cause,
          Object.getOwnPropertyNames(cause).filter(p => p !== 'stack'),
          2,
        ),
      )
      console.groupEnd()
    }
  }

  public static printErrorToConsole(
    error: Error | CustomError,
    options?: {
      defaultSentryTags: Record<string, string>
      defaultSentryExtras: Record<string, unknown>
    },
  ): void {
    if (error instanceof CustomError) {
      if (error.ignore) {
        console.error(`ignoring error: ${error.name}: ${error.message}`)
        return
      }
      console.group()
      console.error(error.getSentryError())
      console.error(`error-kind: ${error.errorKind}`)
      if (error.causeOfError) {
        console.error('error-cause:')
        CustomError.printNodeJsError(error.causeOfError)
      }
      if (error.extras) {
        console.error('error-extras:')
        console.error(
          JSON.stringify(
            { ..._.omit(options?.defaultSentryExtras, ['config']), ...options?.defaultSentryTags, ...error.extras },
            null,
            2,
          ),
        )
      }
      console.groupEnd()
    } else {
      CustomError.printNodeJsError(error)
    }
  }
}
