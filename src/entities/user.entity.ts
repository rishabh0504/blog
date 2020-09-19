import { AbstractEntity } from "./abstract.entity";
import { Entity, Column, BeforeInsert, BaseEntity, JoinTable, ManyToMany, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { IsEmail } from "class-validator";
import { Exclude, classToPlain } from "class-transformer";
import * as bcrypt from 'bcryptjs';
import { ArticleEntity } from "./article.entity";


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

  @ManyToMany(type => UserEntity, user => user.folloee)
  @JoinTable()
  followers: UserEntity[];


  @ManyToMany(type => UserEntity, user => user.followers)
  folloee: UserEntity[];

  @OneToMany(type => ArticleEntity, article => article.author)
  articles: ArticleEntity[];

  @ManyToMany(type => ArticleEntity, article => article.favouritedBy)
  favourites: ArticleEntity[]

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

  toProfile(user: UserEntity) {
    const following = this.followers.includes(user);
    const profile = this.toJSON();
    delete profile.followers;
    return { ...profile, following }
  }

}