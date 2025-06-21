import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { I18nValidationPipe } from 'nestjs-i18n';

async function bootstrap() 
{
  const app = await NestFactory.create(AppModule,{rawBody:true,bodyParser:true});
app.useGlobalPipes(
  new I18nValidationPipe({
    whitelist: true,
    transform: true,
    validateCustomDecorators: true,}
))
  app.setGlobalPrefix('api/v1');
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();