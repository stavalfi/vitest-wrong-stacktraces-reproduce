import { Global, Module } from '@nestjs/common'
import { createLoggerModule, getPackageJson, SentryModule, ConfigModule } from '@coti-cvi/common-be'

@Global()
@Module({
  providers: [
    {
      provide: 'ServiceNameToken',
      useFactory: () => getPackageJson(__dirname).name,
    },
  ],
  exports: ['ServiceNameToken'],
})
export class ServiceInfoModule {}

@Module({
  imports: [ServiceInfoModule, SentryModule, createLoggerModule(), ConfigModule],
})
export class AppModule {}
