import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { RegisterDTO, LoginDTO } from 'src/models/users/users.dto';

@Injectable()
export class AuthService {

  private mockUser = {
    email: 'rishabh.tiwari0504@gmail.com',
    token: 'jwt.token.here',
    username: 'rishabh0504',
    bio: 'Software developer',
    image: null
  }


  login(credential: LoginDTO) {
    console.log(credential.email === this.mockUser.email)
    if (credential.email === this.mockUser.email) {
      return this.mockUser;
    } else {
      throw new InternalServerErrorException('User not found')
    }
  }
  register(credential: RegisterDTO) {
    return this.mockUser;
  }
}
