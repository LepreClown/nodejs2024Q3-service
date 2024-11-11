import { Module } from '@nestjs/common';
import { ArtistController } from '../controllers/artist.controller';
import { ArtistService } from '../services/artist.service';

@Module({
  controllers: [ArtistController],
  providers: [ArtistService],
  exports: [ArtistService],
})
export class ArtistModule {}
