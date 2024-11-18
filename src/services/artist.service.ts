import { Injectable, NotFoundException } from '@nestjs/common';
import { Artist } from '../types/artist.types';
import { CreateArtistDto, UpdateArtistDto } from '../dto/artist.dto';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from './prisma.service';
import { rethrow } from '@nestjs/core/helpers/rethrow';

@Injectable()
export class ArtistService {
  constructor(private readonly prismaService: PrismaService) {}

  async getArtists() {
    return this.prismaService.artist.findMany();
  }

  async getArtistById(id: string): Promise<Artist> {
    const artist = await this.prismaService.artist.findUnique({
      where: { id },
    });

    if (!artist) {
      throw new NotFoundException(`Artist with ID ${id} not found`);
    }
    return artist;
  }

  async createArtist(dto: CreateArtistDto): Promise<Artist> {
    return this.prismaService.artist.create({ data: dto });
  }

  async updateArtistById(id: string, dto: UpdateArtistDto): Promise<Artist> {
    const artist = await this.prismaService.artist.findUnique({
      where: { id },
    });

    if (!artist) {
      throw new NotFoundException(`Artist with ID ${id} not found`);
    }

    return this.prismaService.artist.update({
      where: { id },
      data: dto,
    });
  }

  async removeById(id: string) {
    const artist = await this.prismaService.artist.findUnique({
      where: { id },
    });

    if (!artist) throw new NotFoundException('Artist not found');

    await this.prismaService.favoriteArtist.deleteMany({
      where: { artistId: id },
    });

    return this.prismaService.artist.delete({ where: { id } });
  }
}
