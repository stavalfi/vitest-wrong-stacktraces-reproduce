import { nestBeforeAfterEach } from '@coti-cvi/tests-infra-be'
import { AppModule } from '../src/app.module'
import { test } from 'vitest'

const { startApp } = nestBeforeAfterEach()

test.concurrent.only('check liveness is true after service is up', async () => {
  const app = await startApp({
    mainNestModule: AppModule,
  })
})
