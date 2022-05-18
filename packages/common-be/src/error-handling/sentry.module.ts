import { Module, NestModule } from '@nestjs/common'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { ConfigModule } from '../config'
import { SentryInterceptor } from './sentry.interceptor'
import { SentryService } from './sentry.service'

@Module({
  imports: [ConfigModule],
  providers: [
    SentryService,
    {
      provide: APP_INTERCEPTOR,
      useClass: SentryInterceptor,
    },
  ],
  exports: [SentryService],
})
export class SentryModule implements NestModule {
  configure() {}
}
