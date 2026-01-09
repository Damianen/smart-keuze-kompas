import { Test } from '@nestjs/testing';
import { BadRequestException, InternalServerErrorException, NotFoundException, ConflictException, UnauthorizedException } from '@nestjs/common';
import { AbstractHashingService } from '../src/core/auth/security/contract/abstract.hashing.service';
import { AbstractTokenService } from '../src/core/auth/security/contract/abstract.token.service';
import { AbstractLogger } from '../src/core/logger/abstract.logger';
import { AbstractAuthRepository } from '../src/core/auth/contract/auth.abstract.repository';
import { CreateStudentDto } from '../src/application/auth/dto/create.student.dto';
import { Student } from '../src/core/auth/entities/student.entitie';
import { AuthService } from '../src/application/auth/services/auth.service';

type createStudentDto = CreateStudentDto;

describe('AuthService', () => {
    let service: AuthService;

    const repoMock = {
        findByEmail: jest.fn(),
        create: jest.fn(),
    };
    const hashingServiceMock = {
        hash: jest.fn().mockResolvedValue('hashedPassword'),
        compare: jest.fn().mockResolvedValue(true),
    };
    const tokenServiceMock = {
        signToken: jest.fn().mockResolvedValue('valid.token.here'),
    };
    const loggerMock = {
        log: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
    };

    beforeEach(async () => {
        jest.clearAllMocks();

        const moduleRef = await Test.createTestingModule({
        providers: [
            AuthService,
            { provide: AbstractAuthRepository, useValue: repoMock },
            { provide: AbstractHashingService, useValue: hashingServiceMock },
            { provide: AbstractTokenService, useValue: tokenServiceMock },
            { provide: AbstractLogger, useValue: loggerMock },
        ],
        }).compile();

        service = moduleRef.get(AuthService);
    });

    describe('register', () => {
        it('gooit ConflictException als email al bestaat', async () => {
        const dto: createStudentDto = {
            email: 'test@example.com',
            name: 'Test',
            surname: 'User',
            password: 'password123',
            birthDate: new Date('2000-01-01'),
        };

        repoMock.findByEmail.mockResolvedValue(
            new Student('1', dto.email, dto.surname, 'hashedPassword', dto.name, dto.birthDate),
        );

        await expect(service.register(dto)).rejects.toBeInstanceOf(ConflictException);

        expect(repoMock.findByEmail).toHaveBeenCalledWith(dto.email);
        expect(repoMock.create).not.toHaveBeenCalled();
        });

        it('gooit InternalServerErrorException bij onverwachte fout (repo error)', async () => {
            const dto: createStudentDto = {
                email: 'test@example.com',
                name: 'Test',
                surname: 'User',
                password: 'password123',
                birthDate: new Date('2000-01-01'),
            };

            repoMock.findByEmail.mockRejectedValue(new InternalServerErrorException('Error bij registreren'));

            await expect(service.register(dto)).rejects.toBeInstanceOf(InternalServerErrorException);
            });
        });
        it('registreert student succesvol', async () => {
            const dto: createStudentDto = {
                email: 'test@example.com',
                name: 'Test',
                surname: 'User',
                password: 'password123',
                birthDate: new Date('2000-01-01'),
            };

            repoMock.findByEmail.mockResolvedValue(null);
            repoMock.create.mockResolvedValue(
                new Student('1', dto.email, dto.surname, 'hashedPassword', dto.name, dto.birthDate),
            );

            const result = await service.register(dto);

            expect(repoMock.findByEmail).toHaveBeenCalledWith(dto.email);
            expect(repoMock.create).toHaveBeenCalled();

            // Verwacht hier wat jouw service daadwerkelijk returned (DTO/Student/etc)
            expect(result).toMatchObject({
                id: '1',
                email: dto.email,
                surname: dto.surname,
                name: dto.name,
            });
    });
    describe('login', () => {
        it('gooit NotFoundException als student niet bestaat', async () => {
            const dto = {
                email: ''
            , password: 'password123' };

            repoMock.findByEmail.mockResolvedValue(null);
            await expect(service.login(dto)).rejects.toBeInstanceOf(NotFoundException);

            expect(repoMock.findByEmail).toHaveBeenCalledWith(dto.email);
        });

        it('gooit UnauthorizedException bij ongeldig wachtwoord', async () => {
            const dto = {
                email: '', password: 'wrongPassword' };

            repoMock.findByEmail.mockResolvedValue(
                new Student('1', dto.email, 'User', 'hashedPassword', 'Test', new Date('2000-01-01')),
            );
            hashingServiceMock.compare.mockResolvedValue(false);
            await expect(service.login(dto)).rejects.toBeInstanceOf(UnauthorizedException);

            expect(repoMock.findByEmail).toHaveBeenCalledWith(dto.email);
            expect(hashingServiceMock.compare).toHaveBeenCalledWith(dto.password, 'hashedPassword');
        });

        it('gooit InternalServerErrorException bij onverwachte fout (token service error)', async () => {
            const dto = { email: '', password: 'password123' };
            repoMock.findByEmail.mockResolvedValue(
                new Student('1', dto.email, 'User', 'hashedPassword', 'Test', new Date('2000-01-01')),
            );
            hashingServiceMock.compare.mockResolvedValue(true);
            tokenServiceMock.signToken.mockRejectedValue(new Error('Token service error'));

            await expect(service.login(dto)).rejects.toBeInstanceOf(InternalServerErrorException);

            expect(repoMock.findByEmail).toHaveBeenCalledWith(dto.email);
            expect(hashingServiceMock.compare).toHaveBeenCalledWith(dto.password, 'hashedPassword');
            expect(tokenServiceMock.signToken).toHaveBeenCalledWith({ sub: 'Test', email: dto.email, id: '1' });
        });

        it('logt student succesvol in', async () => {
            const dto = {
                email: '', password: 'password123' };

            repoMock.findByEmail.mockResolvedValue(
                new Student('1', dto.email, 'User', 'hashedPassword', 'Test', new Date('2000-01-01')),
            );
            hashingServiceMock.compare.mockResolvedValue(true);
            tokenServiceMock.signToken.mockResolvedValue('valid.token.here');
            const result = await service.login(dto);

            expect(repoMock.findByEmail).toHaveBeenCalledWith(dto.email);
            expect(hashingServiceMock.compare).toHaveBeenCalledWith(dto.password, 'hashedPassword');
            expect(tokenServiceMock.signToken).toHaveBeenCalledWith({ sub: 'Test', email: dto.email, id: '1' });
            expect(result).toBe('valid.token.here');
        });
    });
});
