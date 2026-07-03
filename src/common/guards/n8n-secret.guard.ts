import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class N8nSecretGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const provided = request.headers['x-n8n-secret'];
    const expected = process.env.N8N_SHARED_SECRET;

    if (!expected || provided !== expected) {
      throw new UnauthorizedException('Secreto de automatización inválido');
    }

    return true;
  }
}
