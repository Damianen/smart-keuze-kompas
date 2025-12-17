import { Module } from '@nestjs/common';
import { AuthModule } from 'src/infrastructuur/auth/auth.module';
import { KeuzemoduleModule } from './keuzemodule/keuzemodule.module';
import { LoggerModule } from './logger/logger.module';
import { RecommenderSystemModule } from './recommender-system/recommender.system.module';

@Module({
    imports: [AuthModule, KeuzemoduleModule, LoggerModule, RecommenderSystemModule],
})
export class InfrastructureModule {}