import { forwardRef, Module } from '@nestjs/common';
import { FavoriteModule } from './favorite.module';
import { TrackController } from '../controllers/track.controller';
import { TrackService } from '../services/track.service';

@Module({
  controllers: [TrackController],
  providers: [TrackService],
  exports: [TrackService],
})
export class TrackModule {}
