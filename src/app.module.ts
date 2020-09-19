import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataBaseConnectionService } from './database-connection.service';
import { AuthModule } from './auth/auth.module';
import { Connection } from 'typeorm';
import { UserModule } from './user/user.module';
import { ArticleModule } from './article/article.module';

@Module({
  imports: [
    // Database connection

    TypeOrmModule.forRootAsync({
      useClass: DataBaseConnectionService
    }),


    //Individual Module loaded
    AuthModule,
    UserModule,
    ArticleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private connection: Connection) { }

}
