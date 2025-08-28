import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

/* Config */
import env from './config/env.config';

async function bootstrap() {
  const cfg = env();
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api'); // According to project conventions
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await app.listen(cfg.PORT);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();