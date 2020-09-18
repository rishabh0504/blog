import { Controller, Post, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDTO, LoginDTO } from '../models/users/users.dto';

@Controller('users')
export class AuthController {

  constructor(
    private authService: AuthService
  ) { }

  @Post('/register')
  @UsePipes(ValidationPipe) // Either use here in inside @Body like done in Login
  register(@Body() credential: RegisterDTO) {
    return this.authService.register(credential);
  }

  @Post('/login')
  login(@Body(ValidationPipe) credential: LoginDTO) {
    return this.authService.login(credential);
  }

}
