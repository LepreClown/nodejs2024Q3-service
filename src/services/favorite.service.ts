import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { TFavorite } from '../types/favorite.types';
import { LoggingService } from './logging.service';

@Injectable()
export class FavoriteService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly loggingService: LoggingService,
  ) {}

  async fetchAllFavorites() {
    this.loggingService.log('Fetching all favorite items');
    const [tracks, artists, albums] = await Promise.all([
      this.retrieveFavoritesByType('track'),
      this.retrieveFavoritesByType('artist'),
      this.retrieveFavoritesByType('album'),
    ]);
    this.loggingService.log(
      `Fetched favorites - Tracks: ${tracks.length}, Artists: ${artists.length}, Albums: ${albums.length}`,
    );
    return { tracks, artists, albums };
  }

  private async retrieveFavoritesByType(type: TFavorite) {
    this.loggingService.log(`Fetching favorites of type: ${type}`);
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

    const result = favorites[type] ? await favorites[type]() : [];
    this.loggingService.log(`Fetched ${result.length} ${type} items`);
    return result;
  }

  async itemExists(id: string, type: TFavorite): Promise<boolean> {
    this.loggingService.log(`Checking if item exists: ID ${id}, Type ${type}`);
    const exists = Boolean(await this.findItem(id, type));
    this.loggingService.log(
      `Item ${exists ? 'exists' : 'does not exist'}: ID ${id}, Type ${type}`,
    );
    return exists;
  }

  private async findItem(id: string, type: TFavorite) {
    this.loggingService.log(`Finding item: ID ${id}, Type ${type}`);
    const lookup = {
      artist: () => this.prismaService.artist.findUnique({ where: { id } }),
      album: () => this.prismaService.album.findUnique({ where: { id } }),
      track: () => this.prismaService.track.findUnique({ where: { id } }),
    };

    return lookup[type] ? lookup[type]() : null;
  }

  async isFavorite(id: string, type: TFavorite) {
    this.loggingService.log(
      `Checking if item is favorite: ID ${id}, Type ${type}`,
    );
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

    const favorite = lookup[type] ? await lookup[type]() : null;
    this.loggingService.log(
      `Item ${favorite ? 'is' : 'is not'} a favorite: ID ${id}, Type ${type}`,
    );
    return favorite;
  }

  async addFavoriteItem(id: string, type: TFavorite) {
    this.loggingService.log(`Adding item to favorites: ID ${id}, Type ${type}`);
    if (await this.isFavorite(id, type)) {
      this.loggingService.warn(
        `Item already in favorites: ID ${id}, Type ${type}`,
      );
      return { message: 'Item already in favorites' };
    }
    const savedFavorite = await this.saveFavorite(id, type);
    this.loggingService.log(`Item added to favorites: ID ${id}, Type ${type}`);
    return savedFavorite;
  }

  private async saveFavorite(id: string, type: TFavorite) {
    this.loggingService.log(`Saving item to favorites: ID ${id}, Type ${type}`);
    const actions = {
      artist: () =>
        this.prismaService.favoriteArtist.create({ data: { artistId: id } }),
      album: () =>
        this.prismaService.favoriteAlbum.create({ data: { albumId: id } }),
      track: () =>
        this.prismaService.favoriteTrack.create({ data: { trackId: id } }),
    };

    if (!actions[type]) {
      this.loggingService.error(`Unsupported type: ${type}`);
      throw new Error(`Unsupported type: ${type}`);
    }

    return actions[type]();
  }

  async removeFavoriteItem(id: string, type: TFavorite) {
    this.loggingService.log(
      `Removing item from favorites: ID ${id}, Type ${type}`,
    );
    const deleteActions = {
      artist: () =>
        this.prismaService.favoriteArtist.delete({ where: { artistId: id } }),
      album: () =>
        this.prismaService.favoriteAlbum.delete({ where: { albumId: id } }),
      track: () =>
        this.prismaService.favoriteTrack.delete({ where: { trackId: id } }),
    };

    if (!deleteActions[type]) {
      this.loggingService.error(`Unsupported type: ${type}`);
      throw new Error(`Unsupported type: ${type}`);
    }

    await deleteActions[type]();
    this.loggingService.log(
      `Item removed from favorites: ID ${id}, Type ${type}`,
    );
  }
}
