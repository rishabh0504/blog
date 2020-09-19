import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleEntity } from 'src/entities/article.entity';
import { UserEntity } from 'src/entities/user.entity';
import { ArticleDTO, ArticleUpdateDTO } from 'src/models/article/article.model';
import { Repository } from 'typeorm';

@Injectable()
export class ArticleService {

  constructor(
    @InjectRepository(ArticleEntity) private articleRepo: Repository<ArticleEntity>,
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>
  ) { }

  async findBySlug(slug: string) {
    return this.articleRepo.findOne({ where: { slug } })
  }

  private ensureOwnership(user: UserEntity, article: ArticleEntity): boolean {
    return article.author.id === user.id;
  }
  async createArticle(user: UserEntity, articlePayload: ArticleDTO) {
    const article = await this.articleRepo.create(articlePayload)
    article.author = user;
    await article.save()
    return article;
  }

  async updateArticle(slug: string, user: UserEntity, articlaUpdatePayload: ArticleUpdateDTO) {
    const article = await this.findBySlug(slug);
    const isOwner = this.ensureOwnership(user, article);
    if (isOwner) {
      await this.articleRepo.update({ slug }, articlaUpdatePayload);
      return article;
    }
    throw new UnauthorizedException('You do not have access to edit it.');
  }

  async deleteArticle(slug: string, user: UserEntity) {
    const article = await this.findBySlug(slug);
    const isOwner = this.ensureOwnership(user, article);
    if (isOwner) {
      return await this.articleRepo.remove(article);
    }
    throw new UnauthorizedException('You do not have access to delete it.');
  }
}
