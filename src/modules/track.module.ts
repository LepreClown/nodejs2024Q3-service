import { Module } from '@nestjs/common';
import { TrackController } from '../controllers/track.controller';
import { TrackService } from '../services/track.service';

@Module({
  controllers: [TrackController],
  providers: [TrackService],
  exports: [TrackService],
})
export class TrackModule {}
