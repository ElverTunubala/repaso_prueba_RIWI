import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../../common/decorators/roles.decorators';
import { AuthHelperService } from './authHelperService';
import { Request } from 'express';


@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private authHelper: AuthHelperService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!roles) {
      return true; 
    }
    const request = context.switchToHttp().getRequest<Request>();
    const payload = await this.authHelper.validateToken(request);
    const userRole = payload.rol; // devuelve user o admin
    

    if (!roles.includes(userRole)) {
      throw new ForbiddenException('You do not have permission to access this resource');
    }
    return true;
  }
}
