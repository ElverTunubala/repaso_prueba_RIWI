import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtAuthService } from '../jwtServices/jwt.service'; 
import { Request } from 'express';

@Injectable()
export class AuthHelperService {
  constructor(private authService: JwtAuthService) {}

  async validateToken(request: Request): Promise<any> {
    const token = this.authService.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }
    const payload = await this.authService.verifyToken(token);
    return payload;
  }
}
