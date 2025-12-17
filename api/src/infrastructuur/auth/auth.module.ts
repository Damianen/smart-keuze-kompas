import { Module } from '@nestjs/common';
import { AbstractAuthRepository } from 'src/core/auth/contract/auth.abstract.repository';
import { BcryptHashingService } from 'src/infrastructuur/auth/security/service/bcrypt.hashing.service';
import { AuthRepository } from 'src/infrastructuur/auth/repositories/auth.repository';
import { AbstractHashingService } from 'src/core/auth/security/contract/abstract.hashing.service';
import { DatabaseModule } from 'src/infrastructuur/db/database';
import { JwtTokenService } from 'src/infrastructuur/auth/security/service/jwt.token.service';
import { AbstractTokenService } from 'src/core/auth/security/contract/abstract.token.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from '../../infrastructuur/auth/guard/auth.guard';
import { LoggerModule } from '../logger/logger.module';

@Module({
    imports: [DatabaseModule, JwtModule.register({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '1h' },
    })],
    providers: [
        {
            provide: AbstractAuthRepository,
            useClass: AuthRepository,
        },
        {
            provide: AbstractHashingService,
            useClass: BcryptHashingService,
        },
        {
            provide: AbstractTokenService,
            useClass: JwtTokenService,
        },
    ],
    exports: [AbstractAuthRepository, AbstractHashingService, AbstractTokenService],
})
export class AuthModule {}