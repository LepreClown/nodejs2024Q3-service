import { Module } from '@nestjs/common';
import { TrackController } from '../controllers/track.controller';
import { TrackService } from '../services/track.service';
import { PrismaModule } from './prisma.module';
import { LoggingService } from '../services/logging.service';

@Module({
  imports: [PrismaModule],
  controllers: [TrackController],
  providers: [TrackService, LoggingService],
})
export class TrackModule {}
