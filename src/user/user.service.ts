import { Injectable, Body } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { ProfileDTO, UserDTO } from 'src/models/users/users.model';

@Injectable()
export class UserService {



  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>
  ) { }

  async findByUsername(username: string): Promise<UserEntity> {
    return this.userRepo.findOne({ where: { username } })
  }

  async updateUserByUsername(username: string, data: UserDTO): Promise<UserEntity> {
    await this.userRepo.update({ username }, data);
    return this.findByUsername(username)
  }

  async getProfile(username: string): Promise<UserEntity> {
    return this.findByUsername(username);
  }
  async unfollowUser(activeUser: UserEntity, username: string) {
    const user = await this.userRepo.findOne({ where: { username }, relations: ['followers'] })
    //user.followers.push(activeUser);
    user.followers = user.followers.filter((follower) => {
      return follower !== activeUser;
    })
    await user.save();
    return user.toProfile(activeUser)
  }
  async followUser(activeUser: UserEntity, username: string) {
    const user = await this.userRepo.findOne({ where: { username }, relations: ['followers'] })
    user.followers.push(activeUser);
    await user.save();
    return user.toProfile(activeUser)
  }

}
