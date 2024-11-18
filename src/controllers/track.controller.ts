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
import { TrackService } from '../services/track.service';
import { CreateTrackDto, UpdateTrackDto } from '../dto/track.dto';
import { Track } from '../types/track.types';

@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Get()
  async getTracks() {
    return this.trackService.getTracks();
  }

  @Get(':id')
  async getTrackById(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<Track> {
    return this.trackService.getTrackById(id);
  }

  @Post()
  async createTrack(@Body() dto: CreateTrackDto): Promise<Track> {
    return this.trackService.createTrack(dto);
  }

  @Put(':id')
  async updateTrackById(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: UpdateTrackDto,
  ): Promise<Track> {
    return this.trackService.updateTrackById(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  async removeById(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    return this.trackService.removeById(id);
  }
}
