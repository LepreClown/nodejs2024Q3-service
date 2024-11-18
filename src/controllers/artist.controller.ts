import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ArtistService } from '../services/artist.service';
import { Artist } from '../types/artist.types';
import { CreateArtistDto, UpdateArtistDto } from '../dto/artist.dto';

@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Get()
  async getArtists() {
    return this.artistService.getArtists();
  }

  @Get(':id')
  async getArtistById(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<Artist> {
    return this.artistService.getArtistById(id);
  }

  @Post()
  async createArtist(@Body() dto: CreateArtistDto): Promise<Artist> {
    return this.artistService.createArtist(dto);
  }

  @Put(':id')
  async updateUserById(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: UpdateArtistDto,
  ): Promise<Artist> {
    return this.artistService.updateArtistById(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  async removeById(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    return this.artistService.removeById(id);
  }
}
