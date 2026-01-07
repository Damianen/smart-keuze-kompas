import { Module } from '@nestjs/common';
import { InfrastructureModule } from './infrastructuur/infrastructure.module';
import { PresentationModule } from './presentation/presentation.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { seconds } from '@nestjs/throttler';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			cache: true,
			envFilePath: `.env`,
		}),
		ThrottlerModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (config: ConfigService) => [
				{ 
					ttl: seconds(config.get<number>('THROTTLE_TTL', 60)),
				  	limit: config.get<number>('THROTTLE_LIMIT', 100),
				}
			]
		}),
		InfrastructureModule, 
		PresentationModule,
	],

	providers: [
		{
			provide: APP_GUARD,
			useClass: ThrottlerGuard,
		}
	]
})
export class AppModule {}
