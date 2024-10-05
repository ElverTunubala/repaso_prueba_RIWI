import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './jwtServices/jwt.constants';
import { JwtAuthService } from './jwtServices/jwt.service';
import { AuthGuard } from './guards/jwt-auth.guards';
import { AuthHelperService } from './guards/authHelperService';
import { RolesGuard } from './guards/roles.guards';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '5m' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthService, AuthGuard, AuthHelperService, RolesGuard, AuthHelperService],
  exports: [AuthHelperService]
})
export class AuthModule {}
