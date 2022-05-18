import { CleanupFunction } from './types'
import { beforeAll, beforeEach, afterEach, afterAll } from 'vitest'

export function cleanupBeforeAfter(): {
  connectionsCleanups: CleanupFunction[]
  resourcesInstancesCleanups: CleanupFunction[]
  resourcesCleanups: CleanupFunction[]
} {
  const connectionsCleanups: CleanupFunction[] = []
  const resourcesInstancesCleanups: CleanupFunction[] = []
  const resourcesCleanups: CleanupFunction[] = []

  beforeEach(() => {
    connectionsCleanups.splice(0, connectionsCleanups.length)
    resourcesInstancesCleanups.splice(0, resourcesInstancesCleanups.length)
  })

  afterEach(async () => {
    await Promise.all(connectionsCleanups.map(x => x()))
    await Promise.all(resourcesInstancesCleanups.map(x => x()))
  })

  beforeAll(() => {
    resourcesCleanups.splice(0, resourcesCleanups.length)
  })

  afterAll(async () => {
    await Promise.all(resourcesCleanups.map(x => x()))
  })

  return {
    connectionsCleanups,
    resourcesInstancesCleanups,
    resourcesCleanups,
  }
}
