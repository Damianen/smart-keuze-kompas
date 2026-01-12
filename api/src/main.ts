import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.setGlobalPrefix('api');
	app.enableCors({
		origin: true,
		credentials: true,
	});
	app.use(cookieParser());

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			transform: true,
			forbidNonWhitelisted: true,
			forbidUnknownValues: true,
			exceptionFactory: (errors) => {
				const errorObject: Record<string, string> = {};
				errors.forEach((err) => {
					const firstmessage = Object.values(
						err.constraints || {},
					)[0];
					errorObject[err.property] = firstmessage;
				});
				return new BadRequestException(errorObject);
			},
		}),
	);
	await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
