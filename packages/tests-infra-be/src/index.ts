import nock from 'nock'
import { cleanupBeforeAfter } from './cleanups'
import { nestAppBeforeAfterEach } from './start-app/start-nest-app'
import { beforeEach } from 'vitest'

export * from './types'

export function nestBeforeAfterEach(options?: { addAdditionalAllowedNockCalls?: string[] }) {
  beforeEach(() => {
    nock.cleanAll()
    nock.disableNetConnect()
    nock.enableNetConnect(host =>
      ['localhost', '127.0.0.1', ...(options?.addAdditionalAllowedNockCalls ?? [])].some(u => host.includes(u)),
    )
  })

  const cleanups = cleanupBeforeAfter()

  const startApp = nestAppBeforeAfterEach(cleanups.connectionsCleanups)

  return {
    startApp,
    cleanupAfterEach: cleanups.connectionsCleanups,
  }
}

export async function sleep(num: number) {
  return new Promise<void>(resolve => setTimeout(resolve, num))
}
