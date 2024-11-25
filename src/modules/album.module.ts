import { Module } from '@nestjs/common';
import { AlbumController } from '../controllers/album.controller';
import { AlbumService } from '../services/album.service';
import { PrismaModule } from './prisma.module';
import { LoggingService } from '../services/logging.service';

@Module({
  imports: [PrismaModule],
  controllers: [AlbumController],
  providers: [AlbumService, LoggingService],
})
export class AlbumModule {}
