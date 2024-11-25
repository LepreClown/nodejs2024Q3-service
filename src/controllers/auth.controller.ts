import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoggingService } from '../services/logging.service';
import { AuthDto } from '../dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly loggingService: LoggingService,
  ) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() signupDto: AuthDto) {
    const { login } = signupDto;
    this.loggingService.log(`Signup attempt for user: ${login}`);

    const result = await this.authService.signup(signupDto);

    this.loggingService.log(`Signup successful for user: ${login}`);
    return result;
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: AuthDto) {
    const { login } = loginDto;
    this.loggingService.log(`Login attempt for user: ${login}`);

    const tokens = await this.authService.login(loginDto);

    this.loggingService.log(`Login successful for user: ${login}`);
    return tokens;
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body('refreshToken') refreshToken: string) {
    if (!refreshToken) {
      this.loggingService.warn(
        'Failed refresh attempt: No refresh token provided',
      );
      throw new UnauthorizedException('Refresh token is required');
    }

    this.loggingService.log(
      `Processing refresh token for request: ${refreshToken}`,
    );

    const tokens = await this.authService.refresh(refreshToken);

    this.loggingService.log('Refresh token processed successfully');
    return tokens;
  }
}
