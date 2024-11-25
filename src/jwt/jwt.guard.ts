import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  private exemptPaths: string[] = ['/auth', '/doc'];

  private isExemptPath(url: string): boolean {
    if (url === '/') {
      return true;
    }

    return this.exemptPaths.some((path) => url.startsWith(path));
  }

  canActivate(context) {
    const request = context.switchToHttp().getRequest();
    const { url } = request;

    if (this.isExemptPath(url)) {
      return true;
    }

    return super.canActivate(context);
  }
}
