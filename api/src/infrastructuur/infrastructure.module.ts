import { Module } from '@nestjs/common';
import { AuthModule } from 'src/infrastructuur/auth/auth.module';
import { KeuzemoduleModule } from './keuzemodule/keuzemodule.module';
import { LoggerModule } from './logger/logger.module';

@Module({
    imports: [AuthModule, KeuzemoduleModule, LoggerModule],
    exports: [LoggerModule]
})
export class InfrastructureModule {}