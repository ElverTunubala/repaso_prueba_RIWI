import { Injectable, CanActivate, ExecutionContext} from '@nestjs/common';
import { Request } from 'express';
import { AuthHelperService } from './authHelperService'; 

@Injectable()
export class AuthGuard implements CanActivate { //Si el método canActivate retorna true, la ruta es accesible; si retorna false, se deniega el acceso.
  constructor(private readonly authHelper: AuthHelperService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
     await this.authHelper.validateToken(request);
    return true;
    
  }
}
