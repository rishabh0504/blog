import { AbstractEntity } from "./abstract.entity";
import { Entity, Column, BeforeInsert, ManyToOne, JoinTable } from "typeorm";
import { classToPlain } from "class-transformer";
import * as slugify from 'slug';
import { UserEntity } from "./user.entity";


@Entity('articles')
export class ArticleEntity extends AbstractEntity {

  @Column()
  slug: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  body: string;

  @ManyToOne(
    type => UserEntity,
    user => user.articles,
    { eager: true }
  )
  author: UserEntity

  @ManyToOne(
    type => UserEntity,
    user => user.favourites,
    { eager: true }
  )
  @JoinTable()
  favouritedBy: UserEntity[]

  @Column('simple-array')
  tagList: string[];



  @BeforeInsert()
  generateSlug() {
    this.slug = slugify(this.title, { lower: true }) +
      '-' + ((Math.random() * Math.pow(36, 6)) | 0).toString();
  }

  toJSON() {
    return classToPlain(this);
  }

  toArticle(user: UserEntity) {
    let favourited = null;
    if (user) {
      favourited = this.favouritedBy.includes(user);
    }
    const article: any = this.toJSON();
    delete article.favouritedBy;
    return { ...article, favourited }
  }
}