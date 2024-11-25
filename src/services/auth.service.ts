import { ForbiddenException, Injectable } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { AuthDto } from '../dto/auth.dto';

@Injectable()
export class AuthService {
  private readonly refreshTokenSecret: string;
  private readonly refreshTokenExpiration: string;
  private readonly saltRounds: number;

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(signupDto: AuthDto) {
    const hashedPassword = await this.hashPassword(signupDto.password);
    const userPayload = { ...signupDto, password: hashedPassword };
    return this.userService.createUser(userPayload);
  }

  async login(loginDto: AuthDto) {
    const user = await this.userService.getUserByLogin(loginDto.login);

    if (
      !user ||
      !(await this.isPasswordValid(loginDto.password, user.password))
    ) {
      throw new ForbiddenException(
        'Invalid login credentials. Please try again.',
      );
    }

    const payload = this.createJwtPayload(user);
    return this.generateTokens(payload);
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.verifyRefreshToken(refreshToken);
      return this.generateTokens(payload);
    } catch {
      throw new ForbiddenException('The refresh token is invalid or expired.');
    }
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }
  private async isPasswordValid(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
  private createJwtPayload(user: any): { userId: string; login: string } {
    return { userId: user.id, login: user.login };
  }
  private generateTokens(payload: { userId: string; login: string }) {
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.refreshTokenSecret,
      expiresIn: this.refreshTokenExpiration,
    });

    return { accessToken, refreshToken };
  }
  private verifyRefreshToken(token: string): any {
    return this.jwtService.verify(token, { secret: this.refreshTokenSecret });
  }
}
