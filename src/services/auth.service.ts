import { ForbiddenException, Injectable } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthDto } from '../dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(dto: AuthDto) {
    const userPayload = await this.prepareUserPayload(dto);

    return this.usersService.createUser(userPayload);
  }

  async login(dto: AuthDto) {
    const user = await this.validateUserCredentials(dto);
    const tokens = this.generateTokens(user);

    return tokens;
  }

  async refresh(refreshToken: string) {
    const payload = this.decodeRefreshToken(refreshToken);
    return this.generateTokens(payload);
  }

  private async prepareUserPayload(dto: AuthDto) {
    const hashedPassword = await bcrypt.hash(
      dto.password,
      this.getSaltRounds(),
    );
    return { ...dto, password: hashedPassword };
  }

  private async validateUserCredentials(dto: AuthDto) {
    const user = await this.usersService.getUserByLogin(dto.login);

    if (!user || !(await this.isPasswordValid(dto.password, user.password))) {
      throw new ForbiddenException(
        'Invalid login credentials. Please try again.',
      );
    }

    return user;
  }

  private async isPasswordValid(plainPassword: string, hashedPassword: string) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  private generateTokens(user): {
    accessToken: string;
    refreshToken: string;
  } {
    const payload = { userId: user.id, login: user.login };
    return {
      accessToken: this.createAccessToken(payload),
      refreshToken: this.createRefreshToken(payload),
    };
  }

  private createAccessToken(payload) {
    return this.jwtService.sign(payload);
  }

  private createRefreshToken(payload) {
    return this.jwtService.sign(payload, {
      secret: this.getRefreshTokenSecret(),
      expiresIn: this.getRefreshTokenExpiration(),
    });
  }

  private decodeRefreshToken(token: string) {
    try {
      return this.jwtService.verify(token, {
        secret: this.getRefreshTokenSecret(),
      });
    } catch {
      throw new ForbiddenException('The refresh token is invalid or expired.');
    }
  }

  private getSaltRounds(): number {
    return Number(process.env.CRYPT_SALT) || 10;
  }

  private getRefreshTokenSecret(): string {
    return process.env.JWT_SECRET_REFRESH_KEY;
  }

  private getRefreshTokenExpiration(): string {
    return process.env.TOKEN_REFRESH_EXPIRE_TIME || '7d';
  }
}
