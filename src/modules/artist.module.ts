import { Module } from '@nestjs/common';
import { ArtistController } from '../controllers/artist.controller';
import { PrismaModule } from './prisma.module';
import { ArtistService } from '../services/artist.service';
import { LoggingService } from '../services/logging.service';

@Module({
  imports: [PrismaModule],
  controllers: [ArtistController],
  providers: [ArtistService, LoggingService],
})
export class ArtistModule {}
