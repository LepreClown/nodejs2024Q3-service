import { Injectable } from '@nestjs/common';
import { Album } from '../types/album.types';

@Injectable()
export class AlbumService {
  private albums: Album[] = [];
}
