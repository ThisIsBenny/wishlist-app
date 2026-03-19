import { Module, OnModuleInit } from '@nestjs/common'
import { APP_PIPE, APP_INTERCEPTOR, APP_GUARD, APP_FILTER } from '@nestjs/core'
import { ZodValidationPipe, ZodSerializerInterceptor } from 'nestjs-zod'
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler'
import { DatabaseModule } from './database.module'
import { MigrationModule } from './migrations/migration.module'
import { MigrationService } from './migrations/migration.service'
import { WishlistModule } from './wishlist/wishlist.module'
import { UtilsModule } from './utils/utils.module'
import { AuthModule } from './auth/auth.module'
import { HealthModule } from './health/health.module'
import { GlobalExceptionFilter } from './filters/http-exception.filter'
import configuration from './config/configuration'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
        blockDuration: 60000,
      },
    ]),
    DatabaseModule,
    MigrationModule,
    WishlistModule,
    UtilsModule,
    AuthModule,
    HealthModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ZodSerializerInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly migrationService: MigrationService) {}

  async onModuleInit() {
    await this.migrationService.runMigrations()
  }
}
