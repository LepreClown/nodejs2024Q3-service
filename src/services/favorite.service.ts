import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { TFavorite } from '../types/favorite.types';

@Injectable()
export class FavoriteService {
  constructor(private readonly prismaService: PrismaService) {}

  async fetchAllFavorites() {
    const [tracks, artists, albums] = await Promise.all([
      this.retrieveFavoritesByType('track'),
      this.retrieveFavoritesByType('artist'),
      this.retrieveFavoritesByType('album'),
    ]);

    return { tracks, artists, albums };
  }

  private async retrieveFavoritesByType(type: TFavorite) {
    const favorites = {
      track: () =>
        this.prismaService.favoriteTrack
          .findMany({ include: { track: true } })
          .then((items) => items.map((item) => item.track)),
      artist: () =>
        this.prismaService.favoriteArtist
          .findMany({ include: { artist: true } })
          .then((items) => items.map((item) => item.artist)),
      album: () =>
        this.prismaService.favoriteAlbum
          .findMany({ include: { album: true } })
          .then((items) => items.map((item) => item.album)),
    };

    return favorites[type] ? favorites[type]() : [];
  }

  async itemExists(id: string, type: TFavorite) {
    return Boolean(await this.findItem(id, type));
  }

  private async findItem(id: string, type: TFavorite) {
    const lookup = {
      artist: () => this.prismaService.artist.findUnique({ where: { id } }),
      album: () => this.prismaService.album.findUnique({ where: { id } }),
      track: () => this.prismaService.track.findUnique({ where: { id } }),
    };

    return lookup[type] ? lookup[type]() : null;
  }

  async isFavorite(id: string, type: TFavorite) {
    const lookup = {
      artist: () =>
        this.prismaService.favoriteArtist.findUnique({
          where: { artistId: id },
        }),
      album: () =>
        this.prismaService.favoriteAlbum.findUnique({ where: { albumId: id } }),
      track: () =>
        this.prismaService.favoriteTrack.findUnique({ where: { trackId: id } }),
    };

    return lookup[type] ? lookup[type]() : null;
  }

  async addFavoriteItem(id: string, type: TFavorite) {
    if (await this.isFavorite(id, type)) {
      return { message: 'Item already in favorites' };
    }
    return this.saveFavorite(id, type);
  }

  private async saveFavorite(id: string, type: TFavorite) {
    const actions = {
      artist: () =>
        this.prismaService.favoriteArtist.create({ data: { artistId: id } }),
      album: () =>
        this.prismaService.favoriteAlbum.create({ data: { albumId: id } }),
      track: () =>
        this.prismaService.favoriteTrack.create({ data: { trackId: id } }),
    };

    if (!actions[type]) {
      throw new Error(`Unsupported type: ${type}`);
    }

    return actions[type]();
  }

  async removeFavoriteItem(id: string, type: TFavorite) {
    const deleteActions = {
      artist: () =>
        this.prismaService.favoriteArtist.delete({ where: { artistId: id } }),
      album: () =>
        this.prismaService.favoriteAlbum.delete({ where: { albumId: id } }),
      track: () =>
        this.prismaService.favoriteTrack.delete({ where: { trackId: id } }),
    };

    if (!deleteActions[type]) {
      throw new Error(`Unsupported type: ${type}`);
    }

    await deleteActions[type]();
  }
}
