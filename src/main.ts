import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { LoggingService } from './services/logging.service';
import { ConfigService } from '@nestjs/config';
import { JwtGuard } from './jwt/jwt.guard';

dotenv.config();

const PORT = process.env.PORT || 3001;

const defaultConfig = new DocumentBuilder()
  .setTitle('Home Library API')
  .setDescription('The home-library API')
  .setVersion('0.0.1')
  .addTag('home-library')
  .build();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const loggingService = app.get(LoggingService);

  app.useLogger(loggingService);

  const document = SwaggerModule.createDocument(app, defaultConfig);
  app.useGlobalGuards(new JwtGuard());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  SwaggerModule.setup('doc', app, document);
  const port = configService.get<number>('PORT') || PORT;

  process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
    loggingService.error(
      'Unhandled Rejection',
      `Reason: ${reason}, Promise: ${promise}`,
    );
  });

  process.on('uncaughtException', (error: Error) => {
    loggingService.error('Uncaught Exception', error.stack || error.message);
    process.exit(1);
  });

  await app.listen(PORT);
  loggingService.log(`Application is running on: http://localhost:${port}`);
}

bootstrap();
