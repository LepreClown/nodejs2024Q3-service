import { Module } from '@nestjs/common';
import { UserController } from '../controllers/user.controller';
import { UserService } from '../services/user.service';
import { PrismaModule } from './prisma.module';
import { LoggingService } from '../services/logging.service';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [UserService, LoggingService],
  exports: [UserService],
})
export class UserModule {}
