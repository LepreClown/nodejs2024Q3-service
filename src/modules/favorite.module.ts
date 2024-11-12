import { forwardRef, Module } from '@nestjs/common';
import { AlbumModule } from './album.module';
import { ArtistModule } from './artist.module';
import { TrackModule } from './track.module';
import { FavoriteController } from '../controllers/favorite.controller';
import { FavoriteService } from '../services/favorite.service';

@Module({
  controllers: [FavoriteController],
  providers: [FavoriteService],
  exports: [FavoriteService],
})
export class FavoriteModule {}
