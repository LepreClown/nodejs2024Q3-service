import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDto, UpdateUserPasswordDto } from '../dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUsers() {
    return this.userService.getUsers();
  }

  @Get(':id')
  async getUserById(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    const user = await this.userService.getUserById(id);
    if (!user) {
      throw new HttpException(
        `User with id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return user;
  }

  @Post()
  createUser(@Body() dto: CreateUserDto) {
    return this.userService.createUser(dto);
  }

  @Put(':id')
  updateById(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: UpdateUserPasswordDto,
  ) {
    return this.userService.updateUserPassword(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  removeById(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.userService.removeById(id);
  }
}
