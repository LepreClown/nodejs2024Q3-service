import { Injectable, NotFoundException } from '@nestjs/common';
import { Artist } from '../types/artist.types';
import { CreateArtistDto, UpdateArtistDto } from '../dto/artist.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ArtistService {
  private artists: Artist[] = [];

  async getArtists(): Promise<Artist[]> {
    return this.artists;
  }

  async getArtistById(id: string): Promise<Artist> {
    const artist = this.artists.find((artist) => artist.id === id);

    if (!artist) {
      throw new NotFoundException(`Artist with ID ${id} not found`);
    }
    return artist;
  }

  async createArtist(dto: CreateArtistDto): Promise<Artist> {
    const newArtist: Artist = {
      id: uuidv4(),
      ...dto,
    };

    this.artists.push(newArtist);
    return newArtist;
  }

  async updateArtistById(
    id: string,
    { name, grammy }: UpdateArtistDto,
  ): Promise<Artist> {
    const artist = this.artists.find((artist) => artist.id === id);

    if (!artist) {
      throw new NotFoundException(`Artist with ID ${id} not found`);
    }

    if (name !== undefined) {
      artist.name = name;
    }

    if (grammy !== undefined) {
      artist.grammy = grammy;
    }

    return artist;
  }

  async removeById(id: string): Promise<void> {
    const artist = this.artists.find((artist) => artist.id === id);
    if (!artist) throw new NotFoundException('Artist not found');

    this.artists = this.artists.filter((artist) => artist.id !== id);
  }
}
