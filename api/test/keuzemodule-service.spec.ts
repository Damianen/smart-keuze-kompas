import { Test } from '@nestjs/testing';
import { BadRequestException, InternalServerErrorException, NotFoundException, ConflictException, UnauthorizedException } from '@nestjs/common';
import { AbstractKeuzeModuleRepository } from 'src/core/keuzemodule/contract/abstract.keuzemodule.repository';
import { AbstractLogger } from 'src/core/logger/abstract.logger';
import { KeuzeModuleService } from 'src/application/keuzemodule/services/keuzemodule.service';
import { KeuzeModule } from 'src/core/keuzemodule/entities/keuzemodule.entitie';
import { KeuzeModuleDto } from 'src/application/keuzemodule/dto/keuzemodule.dto';



describe('KeuzeModuleService', () => {
    let service: KeuzeModuleService;

    const repoMock = {
        getAll: jest.fn(),
        getOne: jest.fn(),
        getByAttribute: jest.fn(),
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
            KeuzeModuleService,
            { provide: AbstractKeuzeModuleRepository, useValue: repoMock },
            { provide: AbstractLogger, useValue: loggerMock },
        ],
        }).compile();

        service = moduleRef.get(KeuzeModuleService);
    });

    describe('getAll', () => {
        it('Ik zou een lijst aan keuze modules moeten krijgen', async () => {
            const keuzeModules: KeuzeModuleDto[] = [
                { id: 1, name: 'Module 1', description: 'Desc 1', studycredit: 5, location: 'Location 1', shortdescription: 'Short Desc 1', content: 'Content 1', level: 'Level 1', learningoutcomes: 'Outcomes 1' },
                { id: 2, name: 'Module 2', description: 'Desc 2', studycredit: 10, location: 'Location 2', shortdescription: 'Short Desc 2', content: 'Content 2', level: 'Level 2', learningoutcomes: 'Outcomes 2' },

            ];

            repoMock.getAll.mockResolvedValue(keuzeModules);

            const result = await service.getAll();

            expect(result).toEqual(keuzeModules);
            expect(repoMock.getAll).toHaveBeenCalledTimes(1);
        });
        it('gooit NotFoundException als er geen keuze modules zijn', async () => {
            repoMock.getAll.mockResolvedValue(null);
            await expect(service.getAll()).rejects.toBeInstanceOf(NotFoundException);
        });
        it('gooit InternalServerErrorException bij onverwachte fout', async () => {
            repoMock.getAll.mockRejectedValue(new Error('Database fout'));
            await expect(service.getAll()).rejects.toBeInstanceOf(InternalServerErrorException);
        });
    });

    describe('getOne', () => {
        it('Ik zou een enkele keuze module moeten krijgen op basis van ID', async () => {
            const keuzeModule: KeuzeModuleDto = { id: 1, name: 'Module 1', description: 'Desc 1', studycredit: 5, location: 'Location 1', shortdescription: 'Short Desc 1', content: 'Content 1', level: 'Level 1', learningoutcomes: 'Outcomes 1' };
            repoMock.getOne.mockResolvedValue(keuzeModule);

            const result = await service.getOne('1');
            expect(result).toEqual(keuzeModule);
            expect(repoMock.getOne).toHaveBeenCalledWith('1');
        });

        it('gooit BadRequestException bij ongeldig ID', async () => {
            await expect(service.getOne('')).rejects.toBeInstanceOf(BadRequestException);
        });
        it('gooit NotFoundException als keuze module niet gevonden is', async () => {
            repoMock.getOne.mockResolvedValue(null);
            await expect(service.getOne('999')).rejects.toBeInstanceOf(NotFoundException);
        });
        it('gooit InternalServerErrorException bij onverwachte fout', async () => {
            repoMock.getOne.mockRejectedValue(new Error('Database fout'));
            await expect(service.getOne('1')).rejects.toBeInstanceOf(InternalServerErrorException);
        });
    });
    describe('getByAttribute', () => {
        it('Ik zou een lijst aan keuze modules moeten krijgen op basis van attribuut', async () => {
            const keuzeModules: KeuzeModuleDto[] = [
                { id: 1, name: 'Module 1', description: 'Desc 1', studycredit: 5, location: 'Location 1', shortdescription: 'Short Desc 1', content: 'Content 1', level: 'Level 1', learningoutcomes: 'Outcomes 1' },
            ];
            repoMock.getByAttribute.mockResolvedValue(keuzeModules);

            const result = await service.getByAttribute('Module 1');
            expect(result).toEqual(keuzeModules);
            expect(repoMock.getByAttribute).toHaveBeenCalledWith(expect.any(String), undefined, undefined);
        });
        it('gooit BadRequestException bij lege attribuut', async () => {
            await expect(service.getByAttribute('')).rejects.toBeInstanceOf(BadRequestException);
        });
        it('gooit NotFoundException als er geen keuze modules gevonden zijn', async () => {
            repoMock.getByAttribute.mockResolvedValue(null);
            await expect(service.getByAttribute('NonExistentModule')).rejects.toBeInstanceOf(NotFoundException);
        });
        it('gooit InternalServerErrorException bij onverwachte fout', async () => {
            repoMock.getByAttribute.mockRejectedValue(new Error('Database fout'));
            await expect(service.getByAttribute('Module 1')).rejects.toBeInstanceOf(InternalServerErrorException);
        });
    });
});