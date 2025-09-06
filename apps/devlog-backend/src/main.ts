import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix('api/v1');

  const config = new DocumentBuilder()
    .setTitle('DevLog API')
    .setDescription(
      'DevLog API provides a modern blogging backend for developers and content creators',
    )
    .setVersion('1.0')
    .addTag('DevLog')
    .build();

  const options: SwaggerCustomOptions = {
    useGlobalPrefix: true,
  };

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory, options);
  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
