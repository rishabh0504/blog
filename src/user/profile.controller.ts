import { Body, Controller, Get, NotFoundException, Param, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/users.decorator';
import { UserEntity } from 'src/entities/user.entity';
import { ProfileDTO } from 'src/models/users/users.model';
import { UserService } from './user.service';

@Controller('profile')
export class ProfileController {
  constructor(private userService: UserService) { }

  @Get(':username')
  @UseGuards(AuthGuard())
  async getProfile(@Param('username') username: string) {
    const user = await this.userService.getProfile(username);
    if (!user) {
      throw new NotFoundException('User does not exist')
    }
    return user;
  }

  @Post('/:username/follow')
  @UseGuards(AuthGuard())
  async follow(@User() user: UserEntity, @Param('username') username: string) {
    return this.userService.followUser(user, username);
  }

  @Post('/:username/unfollow')
  @UseGuards(AuthGuard())
  async unfollow(@User() user: UserEntity, @Param('username') username: string) {
    return this.userService.unfollowUser(user, username);
  }

}
