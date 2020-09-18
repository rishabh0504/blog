import { Controller, Get, UseGuards, Put, Body, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/auth/users.decorator';
import { AuthGuard } from '@nestjs/passport';
import { UserEntity } from 'src/entities/user.entity';
import { UserDTO } from 'src/models/users/users.model';

@Controller('user')
export class UserController {

  constructor(
    private userService: UserService
  ) { }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findLoggedinUser(@User() { username }: UserEntity) {
    return this.userService.findByUsername(username);
  }

  @Put()
  @UseGuards(AuthGuard('jwt'))
  updateUserByUserName(@User() { username }: UserEntity, @Body(ValidationPipe) userData: UserDTO) {
    return this.userService.updateUserByUsername(username, userData);
  }
}
