import { Test } from '@nestjs/testing';
import { BadRequestException, InternalServerErrorException, NotFoundException, ConflictException, UnauthorizedException } from '@nestjs/common';
import { AbstractRecommenderSystemRepository } from 'src/core/recommender-system/contract/abstract.recommender.system.repository';
import { RecommenderSystemService } from 'src/application/recommender-system/services/recommendersystem.service';
import { RecommendationInputDto } from 'src/application/recommender-system/dto/recommentation.input.ai.dto';
import { KeuzemoduleAIDto } from 'src/application/recommender-system/dto/keuzemodule.ai.dto';


describe('RecommenderSystemService', () => {
    let service: RecommenderSystemService;

    const repoMock: jest.Mocked<AbstractRecommenderSystemRepository> = {
        getRecommendations: jest.fn(),
    };
    beforeEach(async () => {
        jest.clearAllMocks();
        const moduleRef = await Test.createTestingModule({
        providers: [
            RecommenderSystemService,
            { provide: AbstractRecommenderSystemRepository, useValue: repoMock },
        ],
        }).compile();
        service = moduleRef.get(RecommenderSystemService);
    });

    describe('getRecommendations', () => {
        it('Ik zou een lijst aan aanbevelingen moeten krijgen', async () => {
            const dto: RecommendationInputDto = { studentInput: 'Ik hou van wiskunde en programmeren' };
            const recommendations: KeuzemoduleAIDto[] = [
                { id: 1, name: 'Inleiding tot Programmeren', location: 'Leer de basis van programmeren.', estimated_difficulty: 3, content_score: 8, popularity_score: 9, hybrid_score: 8.5, reason_text: 'Deze module past goed bij je interesse in programmeren.', level: 'Beginner' },
                { id: 2, name: 'Geavanceerde Wiskunde', location: 'Campus B', estimated_difficulty: 4, content_score: 9, popularity_score: 7, hybrid_score: 8.0, reason_text: 'Deze module sluit aan bij je liefde voor wiskunde.', level: 'Gevorderd' },
            ];

            repoMock.getRecommendations.mockResolvedValue(recommendations);
            const result = await service.getRecommendations(dto);

            expect(result).toEqual(recommendations);
            expect(repoMock.getRecommendations).toHaveBeenCalledWith(dto.studentInput);
        });
        it('gooit NotFoundException als er geen aanbevelingen zijn', async () => {
            const dto: RecommendationInputDto = { studentInput: 'Ik hou van kunst' };
            repoMock.getRecommendations.mockResolvedValue([]);
            await expect(service.getRecommendations(dto)).rejects.toBeInstanceOf(NotFoundException);    
        });
        it('gooit BadRequestException als de input leeg is', async () => {
            const dto: RecommendationInputDto = { studentInput: '' };
            await expect(service.getRecommendations(dto)).rejects.toBeInstanceOf(BadRequestException);
        });
        it('gooit InternalServerErrorException bij onverwachte fout', async () => {
            const dto: RecommendationInputDto = { studentInput: 'Ik hou van geschiedenis' };
            repoMock.getRecommendations.mockRejectedValue(new Error('Database fout'));
            await expect(service.getRecommendations(dto)).rejects.toBeInstanceOf(InternalServerErrorException);
        });
    });
});