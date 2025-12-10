import { Module } from '@nestjs/common';
import { AuthModule } from 'src/infrastructuur/auth/auth.module';

@Module({
    imports: [AuthModule],
})
export class InfrastructureModule {}