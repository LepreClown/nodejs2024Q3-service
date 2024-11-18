import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { AlbumService } from '../services/album.service';
import { Album } from '../types/album.types';
import { CreateAlbumDto, UpdateAlbumDto } from '../dto/album.dto';

@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Get()
  async getAlbums() {
    return this.albumService.getAlbums();
  }

  @Get(':id')
  async getAlbumById(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<Album> {
    return this.albumService.getAlbumById(id);
  }

  @Post()
  async createAlbum(@Body() dto: CreateAlbumDto): Promise<Album> {
    return this.albumService.createAlbum(dto);
  }

  @Put(':id')
  async updateById(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: UpdateAlbumDto,
  ): Promise<Album> {
    return this.albumService.updateAlbumById(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  async removeById(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    return this.albumService.removeById(id);
  }
}
