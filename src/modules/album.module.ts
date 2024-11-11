import { forwardRef, Module } from '@nestjs/common';
import { TrackModule } from './track.module';
import { FavoriteModule } from './favorite.module';
import { AlbumController } from '../controllers/album.controller';
import { AlbumService } from '../services/album.service';

@Module({
  controllers: [AlbumController],
  providers: [AlbumService],
  exports: [AlbumService],
})
export class AlbumModule {}
