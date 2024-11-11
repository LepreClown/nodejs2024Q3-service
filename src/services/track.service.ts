import { Injectable, NotFoundException } from '@nestjs/common';
import { Track } from '../types/track.types';
import { CreateArtistDto } from '../dto/artist.dto';
import { Artist } from '../types/artist.types';
import { v4 as uuidv4 } from 'uuid';
import { CreateTrackDto, UpdateTrackDto } from '../dto/track.dto';

@Injectable()
export class TrackService {
  private tracks: Track[] = [];

  async getTracks(): Promise<Track[]> {
    return this.tracks;
  }

  async getTrackById(id: string): Promise<Track> {
    const track = this.tracks.find((artist) => artist.id === id);

    if (!track) {
      throw new NotFoundException(`Track with ID ${id} not found`);
    }

    return track;
  }

  async createTrack(dto: CreateTrackDto): Promise<Track> {
    const newTrack: Track = {
      id: uuidv4(),
      ...dto,
    };

    this.tracks.push(newTrack);
    return newTrack;
  }

  async updateTrackById(
    id: string,
    { name, albumId, duration, artistId }: UpdateTrackDto,
  ): Promise<Track> {
    const track = this.tracks.find((artist) => artist.id === id);

    if (!track) {
      throw new NotFoundException(`Track with ID ${id} not found`);
    }

    if (artistId) track.artistId = artistId;
    if (albumId) track.albumId = albumId;
    if (name) track.name = name;
    if (duration) track.duration = duration;

    return track;
  }

  async removeById(id: string): Promise<void> {
    const track = this.tracks.find((track) => track.id === id);
    if (!track) throw new NotFoundException('Track not found');

    this.tracks = this.tracks.filter((track) => track.id !== id);
  }
}
