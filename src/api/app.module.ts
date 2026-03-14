import { Module, OnModuleInit } from '@nestjs/common'
import { APP_PIPE, APP_INTERCEPTOR } from '@nestjs/core'
import { ZodValidationPipe, ZodSerializerInterceptor } from 'nestjs-zod'
import { DatabaseModule } from './database.module'
import { MigrationModule } from './migrations/migration.module'
import { MigrationService } from './migrations/migration.service'
import { WishlistModule } from './wishlist/wishlist.module'
import { UtilsModule } from './utils/utils.module'
import { AuthModule } from './auth/auth.module'
import { HealthModule } from './health/health.module'
import configuration from './config/configuration'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
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
  ],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly migrationService: MigrationService) {}

  async onModuleInit() {
    await this.migrationService.runMigrations()
  }
}
