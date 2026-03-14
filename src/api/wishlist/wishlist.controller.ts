import {
  Controller,
  Get,
  Post,
  Put,
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
import { ApiKeyGuard, OptionalApiKey } from '../auth/api-key.guard'
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
  @UseGuards(ApiKeyGuard)
  @OptionalApiKey()
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

  @Post(':id/item')
  @UseGuards(ApiKeyGuard)
  @HttpCode(HttpStatus.CREATED)
  async createItem(
    @Param('id') id: string,
    @Body() createItemDto: CreateWishlistItemDto
  ) {
    const wishlist = await this.wishlistService.getById(id)
    if (!wishlist || !wishlist.id) {
      throw new NotFoundException('Wishlist not found')
    }
    return await this.wishlistService.createItem(wishlist.id, createItemDto)
  }

  @Put(':id')
  @UseGuards(ApiKeyGuard)
  async updateWishlist(
    @Param('id') id: string,
    @Body() updateWishlistDto: UpdateWishlistDto
  ) {
    const wishlist = await this.wishlistService.getById(id)
    if (!wishlist || !wishlist.id) {
      throw new NotFoundException('Wishlist not found')
    }
    return await this.wishlistService.update(wishlist.id, updateWishlistDto)
  }

  @Put(':id/item/:itemId')
  @UseGuards(ApiKeyGuard)
  async updateItem(
    @Param('itemId', ParseIntPipe) itemId: number,
    @Body() updateItemDto: UpdateWishlistItemDto
  ) {
    return await this.wishlistService.updateItem(itemId, updateItemDto)
  }

  @Post(':id/item/:itemId/bought')
  async markItemBought(
    @Param('itemId', ParseIntPipe) itemId: number,
    @Body('bought') bought: boolean | undefined
  ) {
    if (typeof bought !== 'boolean') {
      throw new NotFoundException('Missing or invalid "bought" field')
    }
    return await this.wishlistService.updateItem(itemId, { bought })
  }

  @Delete(':id')
  @UseGuards(ApiKeyGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteWishlist(@Param('id') id: string) {
    const wishlist = await this.wishlistService.getById(id)
    if (!wishlist || !wishlist.id) {
      throw new NotFoundException('Wishlist not found')
    }
    await this.wishlistService.delete(wishlist.id)
  }

  @Delete(':id/item/:itemId')
  @UseGuards(ApiKeyGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteItem(@Param('itemId', ParseIntPipe) itemId: number) {
    await this.wishlistService.deleteItem(itemId)
  }
}
