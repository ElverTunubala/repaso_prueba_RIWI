import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../../common/decorators/roles.decorators';
import { Request } from 'express';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as UserEntity;
    
    if (!user) {
      throw new ForbiddenException('User not found');
    }
    const userRole = user.role; // Ahora puedes acceder al rol del usuario
   
    if (!roles.includes(userRole)) {
      throw new ForbiddenException('You do not have permission to access this resource');
    }
    return true;
  }
}
