import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { UserModule } from './modules/user.module';
import { AlbumModule } from './modules/album.module';
import { ArtistModule } from './modules/artist.module';
import { FavoriteModule } from './modules/favorite.module';
import { TrackModule } from './modules/track.module';
import { PrismaModule } from './modules/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { LoggingService } from './services/logging.service';
import { LoggingMiddleware } from './middleware/logging.middleware';
import { AuthModule } from './modules/auth.module';

@Module({
  imports: [
    PrismaModule,
    AlbumModule,
    ArtistModule,
    FavoriteModule,
    TrackModule,
    AuthModule,
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  providers: [LoggingService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggingMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
