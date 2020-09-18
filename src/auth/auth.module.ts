import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import 'dotenv/config';
import { JWTStrategy } from './jwt.strategy';
@Module({
  imports: [
    // Database entity mapper module
    TypeOrmModule.forFeature([
      UserEntity
    ]),

    // JWT module
    JwtModule.register({
      secret: process.env.APP_SECRET,
      signOptions: {
        expiresIn: 3600
      }
    }),

    // Passport module
    PassportModule.register({
      defaultStrategy: 'jwt'
    })
  ],
  providers: [AuthService, JWTStrategy],
  controllers: [AuthController],
  exports: [PassportModule, JWTStrategy]
})
export class AuthModule { }
