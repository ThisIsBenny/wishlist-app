import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { UtilsService } from './utils.service'
import { ApiKeyGuard } from '../auth/api-key.guard'

@Controller('utils')
export class UtilsController {
  constructor(private readonly utilsService: UtilsService) {}

  @Get('fetchmetadata')
  @UseGuards(ApiKeyGuard)
  async fetchMetadata(@Query('url') url: string) {
    return await this.utilsService.fetchMetadata(url)
  }
}
