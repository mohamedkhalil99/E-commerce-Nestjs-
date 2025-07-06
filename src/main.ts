import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { I18nValidationPipe } from 'nestjs-i18n';
import helmet from 'helmet';

async function bootstrap() 
{
  const app = await NestFactory.create(AppModule,{rawBody:true,bodyParser:true});
  app.use(helmet());//Helmet Security for http headers
  app.enableCors({origin:'*'});//CORS security
  // const {
  //   invalidCsrfTokenError, // This is provided purely for convenience if you plan on creating your own middleware.
  //   generateToken, // Use this in your routes to generate and provide a CSRF hash, along with a token cookie and token.
  //   validateRequest, // Also a convenience if you plan on making your own middleware.
  //   doubleCsrfProtection, // This is the default CSRF protection middleware.
  // } = doubleCsrf(doubleCsrfOptions);
  // app.use(doubleCsrfProtection);
  app.useGlobalPipes(
    new I18nValidationPipe({
      whitelist: true,
      transform: true,
      validateCustomDecorators: true,}
    )
  )
  app.setGlobalPrefix('api/v1');
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();