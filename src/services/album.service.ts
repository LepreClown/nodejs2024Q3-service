import { Injectable, NotFoundException } from '@nestjs/common';
import { Album } from '../types/album.types';
import { CreateAlbumDto, UpdateAlbumDto } from '../dto/album.dto';
import { PrismaService } from './prisma.service';

@Injectable()
export class AlbumService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAlbums() {
    return this.prismaService.album.findMany();
  }

  async getAlbumById(id: string): Promise<Album> {
    const album = await this.prismaService.album.findUnique({ where: { id } });

    if (!album) {
      throw new NotFoundException(`Album with ID ${id} not found`);
    }

    return album;
  }

  async updateAlbumById(id: string, dto: UpdateAlbumDto): Promise<Album> {
    const album = await this.prismaService.album.findUnique({ where: { id } });

    if (!album) {
      throw new NotFoundException(`Album with ID ${id} not found`);
    }

    return this.prismaService.album.update({
      where: { id },
      data: dto,
    });
  }

  async createAlbum(dto: CreateAlbumDto) {
    return this.prismaService.album.create({ data: dto });
  }

  async removeById(id: string) {
    const album = await this.prismaService.album.findUnique({ where: { id } });

    if (!album) throw new NotFoundException('Album not found');

    await this.prismaService.favoriteAlbum.deleteMany({
      where: { albumId: id },
    });

    return this.prismaService.album.delete({ where: { id } });
  }
}
