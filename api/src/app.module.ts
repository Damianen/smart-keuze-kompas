import { Module } from '@nestjs/common';
import { InfrastructureModule } from './infrastructuur/infrastructure.module';
import { PresentationModule } from './presentation/presentation.module';

@Module({
	imports: [
		InfrastructureModule, 
		PresentationModule,
	],
})
export class AppModule {}
