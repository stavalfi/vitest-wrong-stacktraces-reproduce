/* eslint-disable @typescript-eslint/no-explicit-any */
import type { PipeTransform, Type } from '@nestjs/common'
import fs from 'fs'
// @ts-ignore
import pkgUp from 'pkg-up'
import { CustomError, ErrorKind } from '@coti-cvi/lw-sdk'
import { StatusCodes } from 'http-status-codes'
import isEthereumAddress from 'is-ethereum-address'

export function getPackageJson(pathInsidePackage: string): { name: string; version: string } {
  const packageJsonPath = pkgUp.sync({
    cwd: pathInsidePackage,
  })
  if (!packageJsonPath) {
    throw new Error("can't find package.json of this service.")
  }
  return JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
}

// https://stackoverflow.com/a/56044932/806963
export const getEnumKeys = <T extends Record<string, string | number>>(enumObject: T): (keyof T)[] =>
  Object.keys(enumObject).filter(x => Number.isNaN(Number(x)))

export const getEnumValues = <T extends Record<string, string | number>>(enumObject: T): T[keyof T][] => {
  const keys = getEnumKeys(enumObject)
  return keys.map(key => enumObject[key])
}

export function verifyEnumQueryParamPipe<Enum extends Record<string | number, any>, QueryParamKey extends string>(
  enum1: Enum,
  queryParamKey: QueryParamKey,
): Type<PipeTransform> | PipeTransform {
  return {
    transform: (query: Record<QueryParamKey, Enum>) => {
      const r = Object.values(enum1).find(e => e === query[queryParamKey])
      if (!r) {
        throw new CustomError({
          name: 'InvalidParamater',
          message: `Invalid value for enum: ${query[queryParamKey]}. Valid values are: ${Object.values(enum1).join(
            ', ',
          )}`,
          errorKind: ErrorKind.UserError,
          httpStatus: StatusCodes.BAD_REQUEST,
          extras: {
            allQueryParams: query,
            badQueryParam: {
              key: queryParamKey,
              actualInvalidValue: query[queryParamKey] ?? query[queryParamKey] === undefined ? 'not specified' : null,
              expectedValidValues: Object.values(enum1).join(', '),
            },
          },
        })
      }
      return query
    },
  }
}

export function trasformParamToArray(): Type<PipeTransform> | PipeTransform {
  return {
    transform: (queryParamValue: unknown) => {
      if (typeof queryParamValue !== 'string') {
        throw new CustomError({
          name: 'InvalidParamater',
          message: `expected a string represetation of an array (e.g. '1,2,3')`,
          errorKind: ErrorKind.UserError,
          httpStatus: StatusCodes.BAD_REQUEST,
          extras: {
            queryParamValue,
          },
        })
      }

      return queryParamValue.split(',')
    },
  }
}

export function disallowStringArrayWithDuplicatesPipe(): Type<PipeTransform> | PipeTransform {
  return {
    transform: (queryParamValue: unknown[]) => {
      if (!queryParamValue) {
        return []
      }

      if (!Array.isArray(queryParamValue)) {
        throw new CustomError({
          name: 'InvalidParamater',
          message: `expected an array of strings`,
          errorKind: ErrorKind.UserError,
          httpStatus: StatusCodes.BAD_REQUEST,
          extras: {
            queryParamValue,
          },
        })
      }

      if (queryParamValue.length !== new Set(queryParamValue).size) {
        throw new CustomError({
          name: 'InvalidDuplicateValuesParamater',
          message: `expected an array of promitives without duplicates`,
          errorKind: ErrorKind.UserError,
          httpStatus: StatusCodes.BAD_REQUEST,
          extras: {
            queryParamValue,
          },
        })
      }

      return queryParamValue
    },
  }
}

export function verifyValidEthersWalletsIdsPipe(): Type<PipeTransform> | PipeTransform {
  return {
    transform: (queryParamValue: unknown[]) => {
      if (!queryParamValue) {
        return []
      }

      if (!Array.isArray(queryParamValue)) {
        throw new CustomError({
          name: 'InvalidParamater',
          message: `expected an array of strings`,
          errorKind: ErrorKind.UserError,
          httpStatus: StatusCodes.BAD_REQUEST,
          extras: {
            queryParamValue,
          },
        })
      }

      const invalidWalletsIds = queryParamValue.filter(walletId => !isEthereumAddress(walletId))

      if (invalidWalletsIds.length > 0) {
        throw new CustomError({
          name: 'InvalidDuplicateValuesParamater',
          message: `expected an array of valid ether wallet ids`,
          errorKind: ErrorKind.UserError,
          httpStatus: StatusCodes.BAD_REQUEST,
          extras: {
            queryParamValue,
            invalidWalletsIds,
          },
        })
      }

      return queryParamValue
    },
  }
}
