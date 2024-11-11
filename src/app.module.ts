import { Module } from '@nestjs/common';

import { UserModule } from './modules/user.module';
import { AlbumModule } from './modules/album.module';
import { ArtistModule } from './modules/artist.module';
import { FavoriteModule } from './modules/favorite.module';
import { TrackModule } from './modules/track.module';

@Module({
  imports: [AlbumModule, ArtistModule, FavoriteModule, TrackModule, UserModule],
})
export class AppModule {}
