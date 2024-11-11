import { Track } from './track.types';
import { Album } from './album.types';
import { Artist } from './artist.types';

export interface FavoritesResponse {
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
}

export interface Favorites {
  artists: string[];
  albums: string[];
  tracks: string[];
}
