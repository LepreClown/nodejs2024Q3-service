import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  private exemptPaths: string[] = ['/auth', '/doc'];

  private isPathExempt(url: string): boolean {
    if (url === '/') {
      return true;
    }

    return [...this.exemptPaths].some(
      (path) => url === path || url.startsWith(path),
    );
  }

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const { url } = request;

    if (this.isPathExempt(url)) {
      return true;
    }

    return super.canActivate(context) as boolean | Promise<boolean>;
  }
}
