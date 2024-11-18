import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../types/user.types';
import { CreateUserDto, UpdateUserPasswordDto } from '../dto/user.dto';
import { PrismaService } from './prisma.service';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async getUsers() {
    return this.prismaService.user.findMany();
  }

  async getUserById(id: string) {
    const user = await this.prismaService.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
  }

  async createUser(dto: CreateUserDto): Promise<Omit<User, 'password'>> {
    if (!dto.login || !dto.password) {
      throw new BadRequestException('Login and password are required');
    }

    try {
      const newUser = await this.prismaService.user.create({ data: dto });

      return {
        ...newUser,
        createdAt: newUser.createdAt.getTime(),
        updatedAt: newUser.updatedAt.getTime(),
      };
    } catch (error) {
      throw new BadRequestException('Failed to create user');
    }
  }

  async updateUserPassword(
    id: string,
    { oldPassword, newPassword }: UpdateUserPasswordDto,
  ) {
    const user = await this.prismaService.user.findUnique({ where: { id } });

    if (!user) throw new NotFoundException('User not found');

    if (user.password !== oldPassword) {
      throw new ForbiddenException('Password is incorrect');
    }

    const updatedUser = await this.prismaService.user.update({
      where: { id },
      data: {
        password: newPassword,
        version: { increment: 1 },
      },
    });

    return {
      ...updatedUser,
      createdAt: updatedUser.createdAt.getTime(),
      updatedAt: updatedUser.updatedAt.getTime(),
    };
  }

  async removeById(id: string): Promise<void> {
    const user = await this.prismaService.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    await this.prismaService.user.delete({ where: { id } });
  }
}
