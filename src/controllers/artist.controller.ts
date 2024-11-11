import { Controller } from '@nestjs/common';
import { ArtistService } from '../services/artist.service';

@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}
}