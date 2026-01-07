import { Module } from '@nestjs/common';
import { AuthModule } from 'src/infrastructuur/auth/auth.module';
import { KeuzemoduleModule } from './keuzemodule/keuzemodule.module';
import { LoggerModule } from './logger/logger.module';
import { RecommenderSystemModule } from './recommender-system/recommender.system.module';
import { SaveRecommendationModule } from './save-recommendation/save-recommendation.module';

@Module({
    imports: [AuthModule, KeuzemoduleModule, LoggerModule, RecommenderSystemModule, SaveRecommendationModule],
})
export class InfrastructureModule {}