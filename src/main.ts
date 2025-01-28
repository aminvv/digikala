import { NestFactory } from '@nestjs/core';
import { AppModule } from './module/app/app.module';
import { swaggerConfigInit } from './config/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  swaggerConfigInit(app)
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
