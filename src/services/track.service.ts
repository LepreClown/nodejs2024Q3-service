import { Injectable, NotFoundException } from '@nestjs/common';
import { Track } from '../types/track.types';
import { CreateTrackDto, UpdateTrackDto } from '../dto/track.dto';
import { PrismaService } from './prisma.service';
import { LoggingService } from './logging.service';

@Injectable()
export class TrackService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly loggingService: LoggingService,
  ) {}

  async getTracks(): Promise<Track[]> {
    this.loggingService.log('Fetching all tracks');
    const tracks = await this.prismaService.track.findMany();
    this.loggingService.log(`Fetched ${tracks.length} tracks`);
    return tracks;
  }

  async getTrackById(id: string): Promise<Track> {
    this.loggingService.log(`Fetching track with ID ${id}`);
    const track = await this.prismaService.track.findUnique({ where: { id } });

    if (!track) {
      this.loggingService.warn(`Track with ID ${id} not found`);
      throw new NotFoundException(`Track with ID ${id} not found`);
    }

    this.loggingService.log(`Track with ID ${id} fetched`);
    return track;
  }

  async createTrack(dto: CreateTrackDto): Promise<Track> {
    this.loggingService.log('Creating a new track');
    const newTrack = await this.prismaService.track.create({ data: dto });
    this.loggingService.log(`Track created with ID ${newTrack.id}`);
    return newTrack;
  }

  async updateTrackById(id: string, dto: UpdateTrackDto): Promise<Track> {
    this.loggingService.log(`Updating track with ID ${id}`);
    const track = await this.prismaService.track.findUnique({ where: { id } });

    if (!track) {
      this.loggingService.warn(`Track with ID ${id} not found for update`);
      throw new NotFoundException(`Track with ID ${id} not found`);
    }

    const updatedTrack = await this.prismaService.track.update({
      where: { id },
      data: dto,
    });

    this.loggingService.log(`Track with ID ${id} updated`);
    return updatedTrack;
  }

  async removeById(id: string): Promise<Track> {
    this.loggingService.log(`Deleting track with ID ${id}`);
    const track = await this.prismaService.track.findUnique({ where: { id } });

    if (!track) {
      this.loggingService.warn(`Track with ID ${id} not found for deletion`);
      throw new NotFoundException('Track not found');
    }

    await this.prismaService.favoriteTrack.deleteMany({
      where: { trackId: id },
    });

    const deletedTrack = await this.prismaService.track.delete({
      where: { id },
    });
    this.loggingService.log(`Track with ID ${id} deleted`);
    return deletedTrack;
  }
}
