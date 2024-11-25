import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '../types/user.types';
import { CreateUserDto, UpdateUserPasswordDto } from '../dto/user.dto';
import { PrismaService } from './prisma.service';
import { LoggingService } from './logging.service';

@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
    private readonly loggingService: LoggingService,
  ) {}

  async getUsers() {
    this.loggingService.log('Fetching all users');
    const users = await this.prismaService.user.findMany();

    this.loggingService.log(`Fetched ${users.length} users`);
    return users;
  }

  async getUserById(id: string) {
    this.loggingService.log(`Fetching user with ID ${id}`);
    const user = await this.prismaService.user.findUnique({ where: { id } });

    if (!user) {
      this.loggingService.warn(`User with ID ${id} not found`);
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    this.loggingService.log(`User with ID ${id} fetched`);
    return user;
  }

  async getUserByLogin(login: string) {
    this.loggingService.log(`Fetching user with ID ${login}`);
    const user = await this.prismaService.user.findUnique({ where: { login } });

    this.loggingService.log(`User with ID ${login} fetched`);
    return user;
  }

  async createUser(dto: CreateUserDto): Promise<Omit<User, 'password'>> {
    this.loggingService.log('Creating a new user');
    if (!dto.login || !dto.password) {
      this.loggingService.warn('Login and password are required');
      throw new BadRequestException('Login and password are required');
    }

    try {
      const newUser = await this.prismaService.user.create({ data: dto });
      this.loggingService.log(`User created with ID ${newUser.id}`);
      return {
        ...newUser,
        createdAt: newUser.createdAt.getTime(),
        updatedAt: newUser.updatedAt.getTime(),
      };
    } catch (error) {
      this.loggingService.error('Failed to create user', error.message);
      throw new BadRequestException('Failed to create user');
    }
  }

  async updateUserPassword(
    id: string,
    { oldPassword, newPassword }: UpdateUserPasswordDto,
  ): Promise<Omit<User, 'password'>> {
    this.loggingService.log(`Updating password for user with ID ${id}`);
    const user = await this.prismaService.user.findUnique({ where: { id } });

    if (!user) {
      this.loggingService.warn(`User with ID ${id} not found`);
      throw new NotFoundException('User not found');
    }

    if (user.password !== oldPassword) {
      this.loggingService.warn(`Incorrect password for user with ID ${id}`);
      throw new ForbiddenException('Password is incorrect');
    }

    const updatedUser = await this.prismaService.user.update({
      where: { id },
      data: {
        password: newPassword,
        version: { increment: 1 },
      },
    });

    this.loggingService.log(`Password updated for user with ID ${id}`);
    return {
      ...updatedUser,
      createdAt: updatedUser.createdAt.getTime(),
      updatedAt: updatedUser.updatedAt.getTime(),
    };
  }

  async removeById(id: string): Promise<void> {
    this.loggingService.log(`Removing user with ID ${id}`);
    const user = await this.prismaService.user.findUnique({ where: { id } });

    if (!user) {
      this.loggingService.warn(`User with ID ${id} not found`);
      throw new NotFoundException('User not found');
    }

    await this.prismaService.user.delete({ where: { id } });
    this.loggingService.log(`User with ID ${id} removed`);
  }
}
