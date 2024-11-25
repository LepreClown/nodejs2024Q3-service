import { Injectable, NotFoundException } from '@nestjs/common';
import { Album } from '../types/album.types';
import { CreateAlbumDto, UpdateAlbumDto } from '../dto/album.dto';
import { PrismaService } from './prisma.service';
import { LoggingService } from './logging.service';

@Injectable()
export class AlbumService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly loggingService: LoggingService,
  ) {}

  async getAlbums(): Promise<Album[]> {
    this.loggingService.log('Fetching all albums');
    const albums = await this.prismaService.album.findMany();
    this.loggingService.log(`Fetched ${albums.length} albums`);
    return albums;
  }

  async getAlbumById(id: string): Promise<Album> {
    this.loggingService.log(`Fetching album with ID ${id}`);
    const album = await this.prismaService.album.findUnique({ where: { id } });

    if (!album) {
      this.loggingService.warn(`Album with ID ${id} not found`);
      throw new NotFoundException(`Album with ID ${id} not found`);
    }

    this.loggingService.log(`Album with ID ${id} fetched`);
    return album;
  }

  async updateAlbumById(id: string, dto: UpdateAlbumDto): Promise<Album> {
    this.loggingService.log(`Updating album with ID ${id}`);
    const album = await this.prismaService.album.findUnique({ where: { id } });

    if (!album) {
      this.loggingService.warn(`Album with ID ${id} not found for update`);
      throw new NotFoundException(`Album with ID ${id} not found`);
    }

    const updatedAlbum = await this.prismaService.album.update({
      where: { id },
      data: dto,
    });

    this.loggingService.log(`Album with ID ${id} updated`);
    return updatedAlbum;
  }

  async createAlbum(dto: CreateAlbumDto): Promise<Album> {
    this.loggingService.log('Creating new album');
    const newAlbum = await this.prismaService.album.create({ data: dto });
    this.loggingService.log(`Album created with ID ${newAlbum.id}`);
    return newAlbum;
  }

  async removeById(id: string): Promise<Album> {
    this.loggingService.log(`Deleting album with ID ${id}`);
    const album = await this.prismaService.album.findUnique({ where: { id } });

    if (!album) {
      this.loggingService.warn(`Album with ID ${id} not found for deletion`);
      throw new NotFoundException('Album not found');
    }

    await this.prismaService.favoriteAlbum.deleteMany({
      where: { albumId: id },
    });

    const deletedAlbum = await this.prismaService.album.delete({
      where: { id },
    });
    this.loggingService.log(`Album with ID ${id} deleted`);
    return deletedAlbum;
  }
}
