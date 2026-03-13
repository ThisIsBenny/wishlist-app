import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
  NotFoundException,
  ParseIntPipe,
} from '@nestjs/common'
import { WishlistService } from './wishlist.service'
import { ApiKeyGuard } from '../auth/api-key.guard'
import {
  CreateWishlistDto,
  UpdateWishlistDto,
  CreateWishlistItemDto,
  UpdateWishlistItemDto,
} from './dto/wishlist.dto'

interface AuthenticatedRequest {
  isAuthenticated?: boolean
}

@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  async getAll(@Req() req: AuthenticatedRequest) {
    const isAuthenticated = req.isAuthenticated === true
    return await this.wishlistService.getAll(isAuthenticated)
  }

  @Get(':slugText')
  async getBySlugUrlText(@Param('slugText') slugText: string) {
    return await this.wishlistService.getBySlugUrlText(slugText, true)
  }

  @Post()
  @UseGuards(ApiKeyGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createWishlistDto: CreateWishlistDto) {
    return await this.wishlistService.create(createWishlistDto)
  }

  @Post(':slugText/item')
  @UseGuards(ApiKeyGuard)
  @HttpCode(HttpStatus.CREATED)
  async createItem(
    @Param('slugText') slugText: string,
    @Body() createItemDto: CreateWishlistItemDto
  ) {
    const wishlist = await this.wishlistService.getBySlugUrlText(
      slugText,
      false
    )
    if (!wishlist || !wishlist.id) {
      throw new NotFoundException('Wishlist not found')
    }
    return await this.wishlistService.createItem(wishlist.id, createItemDto)
  }

  @Patch(':slugText')
  @UseGuards(ApiKeyGuard)
  async updateWishlist(
    @Param('slugText') slugText: string,
    @Body() updateWishlistDto: UpdateWishlistDto
  ) {
    const wishlist = await this.wishlistService.getBySlugUrlText(
      slugText,
      false
    )
    if (!wishlist || !wishlist.id) {
      throw new NotFoundException('Wishlist not found')
    }
    return await this.wishlistService.update(wishlist.id, updateWishlistDto)
  }

  @Patch(':slugText/item/:itemId')
  @UseGuards(ApiKeyGuard)
  async updateItem(
    @Param('itemId', ParseIntPipe) itemId: number,
    @Body() updateItemDto: UpdateWishlistItemDto
  ) {
    return await this.wishlistService.updateItem(itemId, updateItemDto)
  }

  @Patch(':slugText/item/:itemId/bought')
  @UseGuards(ApiKeyGuard)
  async markItemBought(
    @Param('itemId', ParseIntPipe) itemId: number,
    @Body('bought') bought: boolean
  ) {
    return await this.wishlistService.updateItem(itemId, { bought })
  }

  @Delete(':slugText')
  @UseGuards(ApiKeyGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteWishlist(@Param('slugText') slugText: string) {
    const wishlist = await this.wishlistService.getBySlugUrlText(
      slugText,
      false
    )
    if (!wishlist || !wishlist.id) {
      throw new NotFoundException('Wishlist not found')
    }
    await this.wishlistService.delete(wishlist.id)
  }

  @Delete(':slugText/item/:itemId')
  @UseGuards(ApiKeyGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteItem(@Param('itemId', ParseIntPipe) itemId: number) {
    await this.wishlistService.deleteItem(itemId)
  }
}
