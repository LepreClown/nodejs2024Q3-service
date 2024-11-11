import { Injectable, NotFoundException } from '@nestjs/common';
import { Album } from '../types/album.types';
import { CreateAlbumDto, UpdateAlbumDto } from '../dto/album.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AlbumService {
  private albums: Album[] = [];

  getAlbums(): Album[] {
    return this.albums;
  }

  async getAlbumById(id: string): Promise<Album> {
    const album = this.albums.find((album) => album.id === id);

    if (!album) {
      throw new NotFoundException(`Album with ID ${id} not found`);
    }
    return album;
  }

  async updateAlbumById(
    id: string,
    { artistId, year, name }: UpdateAlbumDto,
  ): Promise<Album> {
    const album = this.albums.find((album) => album.id === id);

    if (!album) {
      throw new NotFoundException(`Album with ID ${id} not found`);
    }
    if (artistId !== undefined) {
      album.artistId = artistId;
    }
    if (year) album.year = year;
    if (name) album.name = name;

    return album;
  }

  async createAlbum({ artistId, year, name }: CreateAlbumDto): Promise<Album> {
    const newAlbum: Album = {
      id: uuidv4(),
      artistId: artistId ?? null,
      name: name,
      year: year,
    };

    this.albums.push(newAlbum);
    return newAlbum;
  }

  async removeById(id: string): Promise<void> {
    const album = this.albums.find((album) => album.id === id);
    if (!album) throw new NotFoundException('Album not found');

    this.albums = this.albums.filter((album) => album.id !== id);
  }
}
