import { Injectable } from '@nestjs/common';
import { Favorites } from '../types/favorite.types';

@Injectable()
export class FavoriteService {
  private favorites: Favorites = {
    artists: [],
    albums: [],
    tracks: [],
  };
}
