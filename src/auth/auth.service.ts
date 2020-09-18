import { Injectable, InternalServerErrorException, UnauthorizedException, ConflictException } from '@nestjs/common';
import { RegisterDTO, LoginDTO } from '../models/users/users.model';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
    private jwtService: JwtService
  ) { }


  async login(credential: LoginDTO) {
    try {
      const user = await this.userRepo.findOne({ where: { email: credential.email } });
      console.log('Compare ', user.comparePassword(credential.password))
      if (user && await user.comparePassword(credential.password)) {
        const payload = { username: user.username };
        const token = this.jwtService.sign(payload);
        return { user: { ...user.toJSON(), token } };
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
      const payload = { username: user.username };
      const token = await this.jwtService.sign(payload);
      return { user: { ...user.toJSON(), token } };
    } catch (err) {
      if (err.code === '23505') {
        throw new ConflictException('User with this email already exists');
      }
      console.log(err)
      throw new InternalServerErrorException('Login error occured')
    }
  }

}
