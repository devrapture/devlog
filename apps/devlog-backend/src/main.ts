// apps/devlog-backend/src/main.ts
import { ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const reflector = app.get(Reflector);

  app.useGlobalInterceptors(new TransformInterceptor(reflector));

  app.useGlobalFilters(new HttpExceptionFilter());

  app.setGlobalPrefix('api/v1');

  const config = new DocumentBuilder()
    .setTitle('DevLog API')
    .setDescription(
      'DevLog API provides a modern blogging backend for developers and content creators',
    )
    .setVersion('1.0')
    .addTag('Auth', 'Authentication-related endpoints')
    .addTag('Users', 'User management endpoints')
    .addTag('Posts', 'Post management endpoints')
    .addTag('Likes', 'Like management endpoints')
    .addTag('Follows', 'Follow management endpoints')
    .addTag('Bookmarks', 'Bookmark management endpoints')
    .addTag('Categories', 'Category management endpoints')
    .addTag('Media', 'Media file management endpoints')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
        description: 'Paste your access token here',
      },
      'access-token',
    )
    .build();

  const options: SwaggerCustomOptions = {
    useGlobalPrefix: true,
    jsonDocumentUrl: '/docs/json',
    swaggerOptions: {
      persistAuthorization: true,
    },
  };

  const documentFactory = () =>
    SwaggerModule.createDocument(app, config, {
      operationIdFactory: (controllerKey: string, methodKey: string) =>
        methodKey,
    });

  SwaggerModule.setup('docs', app, documentFactory, options);
  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
