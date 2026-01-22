import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.setGlobalPrefix('api');
	app.enableCors({
		origin: true,
		credentials: true,
	});
	app.use(cookieParser());

	// Security headers
	app.use(
		helmet({
			strictTransportSecurity: {
				maxAge: 31536000,
				includeSubDomains: true,
			},
			contentSecurityPolicy: {
				directives: {
					defaultSrc: ["'self'"],
					scriptSrc: ["'self'"],
					styleSrc: ["'self'", "'unsafe-inline'"],
					imgSrc: ["'self'", 'data:', 'https:'],
					connectSrc: ["'self'"],
					fontSrc: ["'self'"],
					objectSrc: ["'none'"],
					frameSrc: ["'none'"],
					frameAncestors: ["'none'"],
				},
			},
			xFrameOptions: { action: 'deny' },
			xContentTypeOptions: true,
			referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
		}),
	);
	app.use((req: any, res: any, next: any) => {
		res.setHeader(
			'Permissions-Policy',
			'geolocation=(), microphone=(), camera=(), payment=(), usb=()',
		);
		next();
	});

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			transform: true,
			forbidNonWhitelisted: true,
			forbidUnknownValues: true,
			transformOptions: { enableImplicitConversion: true },
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
