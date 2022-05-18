// NOTE: do NOT change the order of the imports in this file!

import 'reflect-metadata'

import { initializeNestService } from '@coti-cvi/common-be'
import { AppModule } from './app.module'

export { AppModule }

if (require.main === module) {
  initializeNestService({ AppModule })
}
