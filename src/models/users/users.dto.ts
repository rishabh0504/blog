import { IsString, IsEmail, IsNotEmpty, MAX_LENGTH, MinLength, MaxLength } from 'class-validator';



export class LoginDTO {
  @IsString()
  @IsEmail()
  @MinLength(7)
  email: string;

  @IsString()
  @MinLength(5)
  password: string;
}

export class RegisterDTO extends LoginDTO {
  @IsString()
  @MinLength(5)
  username: string;
}

