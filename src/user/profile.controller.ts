import { Body, Controller, Get, NotFoundException, Param, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProfileDTO } from 'src/models/users/users.model';
import { UserService } from './user.service';

@Controller('profile')
export class ProfileController {
  constructor(private userService: UserService) { }

  @Get(':username')
  @UseGuards(AuthGuard())
  async getProfile(@Param('username') username) {
    const user = await this.userService.getProfile(username);
    if (!user) {
      throw new NotFoundException('User does not exist')
    }
    return user;
  }
}
