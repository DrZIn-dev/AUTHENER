import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger as PinoLogger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { configService } from './pkg/config/config.service';

async function bootstrap() {
  const logger = new Logger(bootstrap.name);

  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Authentication by meDev.')
    .setDescription('This is authentication server docs')
    .setVersion('1.1')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-doc', app, document);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.setGlobalPrefix('/auth');
  app.useLogger(app.get(PinoLogger));
  await app.listen(configService.getPort());
  logger.log(`service listen on port ${configService.getPort()}`);
}

bootstrap();
