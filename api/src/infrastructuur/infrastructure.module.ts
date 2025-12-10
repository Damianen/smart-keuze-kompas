import { Module } from '@nestjs/common';
import { AuthModule } from 'src/infrastructuur/auth/auth.module';
import { KeuzemoduleModule } from './keuzemodule/keuzemodule.module';

@Module({
    imports: [AuthModule, KeuzemoduleModule],
})
export class InfrastructureModule {}