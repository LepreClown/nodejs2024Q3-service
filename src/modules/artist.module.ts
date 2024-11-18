import { Module } from '@nestjs/common';
import { ArtistController } from '../controllers/artist.controller';
import { PrismaModule } from './prisma.module';
import { ArtistService } from '../services/artist.service';

@Module({
  imports: [PrismaModule],
  controllers: [ArtistController],
  providers: [ArtistService],
})
export class ArtistModule {}
