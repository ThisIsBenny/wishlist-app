import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database.module'
import { AuthModule } from '../auth/auth.module'
import { WishlistController } from './wishlist.controller'
import { WishlistService } from './wishlist.service'
import { WishlistRepository } from './wishlist.repository'

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [WishlistController],
  providers: [WishlistService, WishlistRepository],
  exports: [WishlistService],
})
export class WishlistModule {}
