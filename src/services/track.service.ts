import { Injectable } from '@nestjs/common';
import { Track } from '../types/track.types';

@Injectable()
export class TrackService {
  private tracks: Track[] = [];
}
