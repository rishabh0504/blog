import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/users.decorator';
import { UserEntity } from 'src/entities/user.entity';
import { ArticleDTO, ArticleUpdateDTO } from 'src/models/article/article.model';
import { ArticleService } from './article.service';

@Controller('article')
export class ArticleController {

  constructor(private articleService: ArticleService) { }
  @Get('/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.articleService.findBySlug(slug)
  }

  @Post()
  @UseGuards(AuthGuard())
  createArticle(@User() user: UserEntity, @Body(ValidationPipe) articeDTO: ArticleDTO) {
    return this.articleService.createArticle(user, articeDTO)
  }


  @Put('/:slug')
  @UseGuards(AuthGuard())
  async updateArticle(
    slug: string,
    @User() user: UserEntity,
    @Body(ValidationPipe) updateArticlePayload: ArticleUpdateDTO) {
    const article = await this.articleService.updateArticle(slug, user, updateArticlePayload);
    return article;
  }

  @Delete('/:slug')
  @UseGuards(AuthGuard())
  async deleteArticle(
    slug: string,
    @User() user: UserEntity
  ) {
    return await this.articleService.deleteArticle(slug, user);
  }
}
