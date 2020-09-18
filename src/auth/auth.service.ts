import { Injectable, InternalServerErrorException, UnauthorizedException, ConflictException } from '@nestjs/common';
import { RegisterDTO, LoginDTO } from '../models/users/users.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
  ) { }

  async login(credential: LoginDTO) {
    try {

      const user = await this.userRepo.findOne({ where: { email: credential.email } });
      if (user && user.comparePassword(credential.password)) {
        return user;
      }
      throw new UnauthorizedException('Wrong credentials.')
    } catch (err) {

      throw new InternalServerErrorException('Login error occured')
    }


  }
  async register(credential: RegisterDTO) {
    try {
      const user = this.userRepo.create(credential);
      await user.save();
      return user;
    } catch (err) {
      if (err.code === '23505') {
        throw new ConflictException('User with this email already exists');
      }
      console.log(err)
      throw new InternalServerErrorException('Login error occured')
    }
  }
}
