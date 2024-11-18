import { Injectable, NotFoundException } from '@nestjs/common';
import { Track } from '../types/track.types';
import { CreateTrackDto, UpdateTrackDto } from '../dto/track.dto';
import { PrismaService } from './prisma.service';

@Injectable()
export class TrackService {
  constructor(private readonly prismaService: PrismaService) {}

  async getTracks(): Promise<Track[]> {
    return this.prismaService.track.findMany();
  }

  async getTrackById(id: string): Promise<Track> {
    const track = await this.prismaService.track.findUnique({ where: { id } });

    if (!track) {
      throw new NotFoundException(`Track with ID ${id} not found`);
    }

    return track;
  }

  async createTrack(dto: CreateTrackDto): Promise<Track> {
    return this.prismaService.track.create({ data: dto });
  }

  async updateTrackById(id: string, dto: UpdateTrackDto): Promise<Track> {
    const track = await this.prismaService.track.findUnique({ where: { id } });

    if (!track) {
      throw new NotFoundException(`Track with ID ${id} not found`);
    }

    return this.prismaService.track.update({
      where: { id },
      data: dto,
    });
  }

  async removeById(id: string) {
    const track = await this.prismaService.track.findUnique({ where: { id } });
    if (!track) throw new NotFoundException('Track not found');

    await this.prismaService.favoriteTrack.deleteMany({
      where: { trackId: id },
    });

    return this.prismaService.track.delete({ where: { id } });
  }
}
