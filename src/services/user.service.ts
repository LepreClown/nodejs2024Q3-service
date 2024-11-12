import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../types/user.types';
import { CreateUserDto, UpdateUserPasswordDto } from '../dto/user.dto';

@Injectable()
export class UserService {
  private users: User[] = [];

  async getUsers(): Promise<User[]> {
    return this.users;
  }

  async getUserById(id: string): Promise<User> {
    const user = this.users.find((user) => user.id === id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async createUser(dto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const existingUser = this.users.find((user) => user.login === dto.login);
    if (existingUser) {
      throw new BadRequestException('User with this login already exists');
    }

    const newUser: User = {
      id: uuidv4(),
      login: dto.login,
      password: dto.password,
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.users.push(newUser);
    const { password, ...result } = newUser;

    return result;
  }

  async updateUserPassword(id: string, dto: UpdateUserPasswordDto) {
    const user = this.users.find((user) => user.id === id);

    if (!user) throw new NotFoundException('User not found');
    if (user.password !== dto.oldPassword) {
      throw new ForbiddenException('Password is incorrect');
    }

    user.password = dto.newPassword;
    user.version += 1;
    user.updatedAt = Date.now();

    const { password, ...result } = user;
    return result;
  }

  async removeById(id: string): Promise<void> {
    const user = this.users.find((user) => user.id === id);
    if (!user) throw new NotFoundException('User not found');

    this.users = this.users.filter((user) => user.id !== id);
  }
}
