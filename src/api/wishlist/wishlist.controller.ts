import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common'
import { WishlistService } from './wishlist.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { Public } from '../auth/public.decorator'
import { CurrentUser } from '../auth/current-user.decorator'
import type { JwtUser } from '../auth/current-user.decorator'
import {
  CreateWishlistDto,
  CreateWishlistItemDto,
  UpdateWishlistDto,
  UpdateWishlistItemDto,
} from './dto/wishlist.dto'

@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  @Public()
  async getAll(@CurrentUser() user: JwtUser | undefined) {
    const userId = user?.sub
    return await this.wishlistService.getAll(userId)
  }

  @Get(':slugText')
  @Public()
  async getBySlugUrlText(@Param('slugText') slugText: string) {
    return await this.wishlistService.getBySlugUrlText(slugText, true)
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createWishlistDto: CreateWishlistDto,
    @CurrentUser('sub') userId: string
  ) {
    return await this.wishlistService.create(createWishlistDto, userId)
  }

  @Post(':id/item')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createItem(
    @Param('id') id: string,
    @Body() createItemDto: CreateWishlistItemDto,
    @CurrentUser('sub') userId: string
  ) {
    return await this.wishlistService.createItem(id, createItemDto, userId)
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateWishlist(
    @Param('id') id: string,
    @Body() updateWishlistDto: UpdateWishlistDto,
    @CurrentUser('sub') userId: string
  ) {
    return await this.wishlistService.update(id, updateWishlistDto, userId)
  }

  @Put(':id/item/:itemId')
  @UseGuards(JwtAuthGuard)
  async updateItem(
    @Param('itemId', ParseIntPipe) itemId: number,
    @Body() updateItemDto: UpdateWishlistItemDto,
    @CurrentUser('sub') userId: string
  ) {
    return await this.wishlistService.updateItem(itemId, updateItemDto, userId)
  }

  @Post(':id/item/:itemId/bought')
  @Public()
  async markItemBought(@Param('itemId', ParseIntPipe) itemId: number) {
    return await this.wishlistService.updateItem(itemId, { bought: true })
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteWishlist(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string
  ) {
    await this.wishlistService.delete(id, userId)
  }

  @Delete(':id/item/:itemId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteItem(
    @Param('itemId', ParseIntPipe) itemId: number,
    @CurrentUser('sub') userId: string
  ) {
    await this.wishlistService.deleteItem(itemId, userId)
  }
}
