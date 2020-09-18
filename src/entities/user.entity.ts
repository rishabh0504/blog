import { AbstractEntity } from "./abstract.entity";
import { Entity, Column, BeforeInsert, BaseEntity } from "typeorm";
import { IsEmail } from "class-validator";
import { Exclude, classToPlain } from "class-transformer";
import * as bcrypt from 'bcryptjs';


@Entity('users')
export class UserEntity extends AbstractEntity {

  @Column({ nullable: false })
  @IsEmail()
  email: string;

  @Column({ unique: true, nullable: false })
  username: string;

  @Column({ nullable: false })
  @Exclude()
  password: string;

  @Column({ default: '', nullable: true })
  bio: string;

  @Column({ default: null, nullable: true })
  image: string | null;

  @BeforeInsert()
  async hasPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async comparePassword(attempt: string) {
    return await bcrypt.compare(attempt, this.password);
  }

  toJSON() {
    return classToPlain(this);
  }

}