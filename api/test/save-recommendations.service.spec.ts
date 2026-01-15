import { Test } from '@nestjs/testing';
import { BadRequestException, InternalServerErrorException, NotFoundException, ConflictException, UnauthorizedException } from '@nestjs/common';
import { AbstractSaveRecommendation } from 'src/core/save-recommendations/contract/abstract.save-recommendation';
import { SaveRecommendationService } from 'src/application/save-recommendation/services/save-recommendation.service';
import { SaveRecommendationDto } from 'src/application/save-recommendation/dto/save-recommendation.dto';
import { SavedRecommendationsDto } from 'src/application/save-recommendation/dto/saved.recommendations.dto';
import { AbstractLogger } from 'src/core/logger/abstract.logger';
import { KeuzemoduleAIEntity } from 'src/core/recommender-system/entity/keuzemodule.ai.entity';
import { ObjectId } from 'mongodb';


describe('SaveRecommendationService', () => {
    let service: SaveRecommendationService;

    const repoMock = {
        saveRecommendation: jest.fn(),
        getRecommendations: jest.fn(),
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
            SaveRecommendationService,
            { provide: AbstractSaveRecommendation, useValue: repoMock },
            { provide: AbstractLogger, useValue: loggerMock }
        ],
        }).compile();

        service = moduleRef.get(SaveRecommendationService);

    });

    describe('saveRecommendation', () => {
        it('Hier zou de aanbevelingen succesvol moeten opslaan', async () => {
            const studentId = '123';
            const recommendationDto: SaveRecommendationDto[] = [
                { level: 'module1', reason_text: 'Great module', id: 1, location: 'Online', hybrid_score: 90, name: 'Module 1', popularity_score: 95, content_score: 92, estimated_difficulty: 4 },
                { level: 'module2', reason_text: 'Great content', id: 2, location: 'Campus', hybrid_score: 85, name: 'Module 2', popularity_score: 90, content_score: 88, estimated_difficulty: 3 },
            ];
            const expectedResponse = { message: 'Aanbevelingen succesvol opgeslagen.', status: true };
            repoMock.saveRecommendation.mockResolvedValue(expectedResponse);

            const result = await service.saveRecommendation(studentId, recommendationDto);
            expect(result).toEqual(expectedResponse);
            expect(repoMock.saveRecommendation).toHaveBeenCalledWith(studentId, expect.any(Array));
        });
        it('gooit InternalServerErrorException bij onverwachte fout', async () => {
            const studentId = '123';
            const recommendationDto: SaveRecommendationDto[] = [
                { level: 'module1', reason_text: 'Great module', id: 1, location: 'Online', hybrid_score: 90, name: 'Module 1', popularity_score: 95, content_score: 92, estimated_difficulty: 4 },
            ];
            repoMock.saveRecommendation.mockRejectedValue(new InternalServerErrorException('Fout bij opslaan'));
            await expect(service.saveRecommendation(studentId, recommendationDto)).rejects.toBeInstanceOf(InternalServerErrorException);
        });
        it('gooit BadRequestException bij lege studentId', async () => {
            const recommendationDto: SaveRecommendationDto[] = [
                { level: 'module1', reason_text: 'Great module', id: 1, location: 'Online', hybrid_score: 90, name: 'Module 1', popularity_score: 95, content_score: 92, estimated_difficulty: 4 },
            ];
            await expect(service.saveRecommendation('', recommendationDto)).rejects.toBeInstanceOf(BadRequestException);
        });
    });

    describe('getRecommendations', () => {
        it('Hier zou ik de opgeslagen aanbevelingen moeten krijgen', async () => {
            const studentId = '123';
            const savedRecommendations: SavedRecommendationsDto = {
                recommendations: [
                    { level: 'module1', reason_text: 'Great module', id: 1, location: 'Online', hybrid_score: 90, name: 'Module 1', popularity_score: 95, content_score: 92, estimated_difficulty: 4 },
                    { level: 'module2', reason_text: 'Great content', id: 2, location: 'Campus', hybrid_score: 85, name: 'Module 2', popularity_score: 90, content_score: 88, estimated_difficulty: 3 },
                ],
                savedAt: new Date(),
            };
            repoMock.getRecommendations.mockResolvedValue(savedRecommendations);
            const result = await service.getRecommendations(studentId);

            expect(result).toEqual(savedRecommendations);
            expect(repoMock.getRecommendations).toHaveBeenCalledWith(studentId);
        });
        it('gooit NotFoundException als er geen aanbevelingen zijn gevonden', async () => {
            const studentId = '123';
            repoMock.getRecommendations.mockResolvedValue(null);
            await expect(service.getRecommendations(studentId)).rejects.toBeInstanceOf(NotFoundException);
        });
        it('gooit InternalServerErrorException bij onverwachte fout', async () => {
            const studentId = '123';
            repoMock.getRecommendations.mockRejectedValue(new Error('Fout bij ophalen'));
            await expect(service.getRecommendations(studentId)).rejects.toBeInstanceOf(InternalServerErrorException);
        });
        it('gooit BadRequestException bij lege studentId', async () => {
            await expect(service.getRecommendations('')).rejects.toBeInstanceOf(BadRequestException);
        });
    });
});
