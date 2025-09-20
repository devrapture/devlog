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
    .addTag('Health', 'Health-related endpoints')
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

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
      if (!origin) return callback(null, true);

      const allowedOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000'];

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      if (allowedOrigins.includes(origin)) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        callback(null, true);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        callback(null, false);
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Authorization',
    maxAge: 600,
  });

  await app.listen(process.env.PORT ?? 8080);
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
