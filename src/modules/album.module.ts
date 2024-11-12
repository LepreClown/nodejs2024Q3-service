import { Module } from '@nestjs/common';
import { AlbumController } from '../controllers/album.controller';
import { AlbumService } from '../services/album.service';

@Module({
  controllers: [AlbumController],
  providers: [AlbumService],
  exports: [AlbumService],
})
export class AlbumModule {}
