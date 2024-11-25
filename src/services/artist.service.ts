import { Injectable, NotFoundException } from '@nestjs/common';
import { Artist } from '../types/artist.types';
import { CreateArtistDto, UpdateArtistDto } from '../dto/artist.dto';
import { PrismaService } from './prisma.service';
import { LoggingService } from './logging.service';

@Injectable()
export class ArtistService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly loggingService: LoggingService,
  ) {}

  async getArtists(): Promise<Artist[]> {
    this.loggingService.log('Fetching all artists');
    const artists = await this.prismaService.artist.findMany();
    this.loggingService.log(`Fetched ${artists.length} artists`);
    return artists;
  }

  async getArtistById(id: string): Promise<Artist> {
    this.loggingService.log(`Fetching artist with ID ${id}`);
    const artist = await this.prismaService.artist.findUnique({
      where: { id },
    });

    if (!artist) {
      this.loggingService.warn(`Artist with ID ${id} not found`);
      throw new NotFoundException(`Artist with ID ${id} not found`);
    }

    this.loggingService.log(`Artist with ID ${id} fetched`);
    return artist;
  }

  async createArtist(dto: CreateArtistDto): Promise<Artist> {
    this.loggingService.log('Creating a new artist');
    const newArtist = await this.prismaService.artist.create({ data: dto });
    this.loggingService.log(`Artist created with ID ${newArtist.id}`);
    return newArtist;
  }

  async updateArtistById(id: string, dto: UpdateArtistDto): Promise<Artist> {
    this.loggingService.log(`Updating artist with ID ${id}`);
    const artist = await this.prismaService.artist.findUnique({
      where: { id },
    });

    if (!artist) {
      this.loggingService.warn(`Artist with ID ${id} not found for update`);
      throw new NotFoundException(`Artist with ID ${id} not found`);
    }

    const updatedArtist = await this.prismaService.artist.update({
      where: { id },
      data: dto,
    });

    this.loggingService.log(`Artist with ID ${id} updated`);
    return updatedArtist;
  }

  async removeById(id: string): Promise<Artist> {
    this.loggingService.log(`Deleting artist with ID ${id}`);
    const artist = await this.prismaService.artist.findUnique({
      where: { id },
    });

    if (!artist) {
      this.loggingService.warn(`Artist with ID ${id} not found for deletion`);
      throw new NotFoundException('Artist not found');
    }

    await this.prismaService.favoriteArtist.deleteMany({
      where: { artistId: id },
    });

    const deletedArtist = await this.prismaService.artist.delete({
      where: { id },
    });

    this.loggingService.log(`Artist with ID ${id} deleted`);
    return deletedArtist;
  }
}
