import { Module } from '@nestjs/common';
import { FavoriteController } from '../controllers/favorite.controller';
import { FavoriteService } from '../services/favorite.service';
import { PrismaModule } from './prisma.module';
import { LoggingService } from '../services/logging.service';

@Module({
  imports: [PrismaModule],
  controllers: [FavoriteController],
  providers: [FavoriteService, LoggingService],
})
export class FavoriteModule {}
