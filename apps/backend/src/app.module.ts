import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { validate } from 'env.validation';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { FileUploadModule } from './file-upload/file-upload.module';
import { PostsModule } from './posts/posts.module';
import { CategoriesModule } from './categories/categories.module';
import { LikesModule } from './likes/likes.module';
import { BookmarksModule } from './bookmarks/bookmarks.module';
import { FollowsModule } from './follows/follows.module';
import { getDatabaseConfig } from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getDatabaseConfig,
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    FileUploadModule,
    PostsModule,
    CategoriesModule,
    LikesModule,
    BookmarksModule,
    FollowsModule,
  ],
})
export class AppModule {}
