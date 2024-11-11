import { Controller } from '@nestjs/common';
import { AlbumService } from '../services/album.service';

@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}
}