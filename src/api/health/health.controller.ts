import { Controller, Get, Inject } from '@nestjs/common'
import { DB_TOKEN, type DbInstance } from '../database.module'
import { Public } from '../auth/public.decorator'
import { wishlists } from '@/db/schema'

@Controller('healthz')
export class HealthController {
  constructor(@Inject(DB_TOKEN) private readonly db: DbInstance) {}

  @Get()
  @Public()
  async check() {
    try {
      await this.db.select().from(wishlists).limit(1).all()
      return { status: 'ok', database: 'connected' }
    } catch {
      return { status: 'ok', database: 'disconnected' }
    }
  }
}
