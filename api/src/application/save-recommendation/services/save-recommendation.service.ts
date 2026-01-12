import { AbstractSaveRecommendation } from 'src/core/save-recommendations/contract/abstract.save-recommendation';
import { KeuzemoduleRecommendationMapper } from '../mapper/mapper';
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { SaveRecommendationDto } from '../dto/save-recommendation.dto';
import { SavedRecommendationsDto } from '../dto/saved.recommendations.dto';

@Injectable()
export class SaveRecommendationService {
    constructor(private readonly saveRecommendationRepository: AbstractSaveRecommendation) {
    }

    async saveRecommendation(studentId: string, recommendationDto: SaveRecommendationDto[]): Promise<{message: string, status: boolean}> {
        this.InputValidation(studentId, recommendationDto);
        try{
            const recommendationEntities = KeuzemoduleRecommendationMapper.toEntity(recommendationDto);

            if (recommendationEntities.length === 0) {
                throw new BadRequestException({message: "Er zijn geen geldige aanbevelingen om op te slaan.", status: false});
            }
            return this.saveRecommendationRepository.saveRecommendation(studentId, recommendationEntities);

        }catch (error){
            if (error instanceof BadRequestException) {
                throw error;
            }
            throw new InternalServerErrorException({message: "Er is een fout opgetreden bij het opslaan van de aanbevelingen.", status: false});
        }
    }
    async getRecommendations(studentId: string): Promise<SavedRecommendationsDto> {
        if (!studentId) {
            throw new BadRequestException({message: "Ongeldig student ID.", status: false});
        }
        try{
            const savedRecommendations = await this.saveRecommendationRepository.getRecommendations(studentId);
            if (!savedRecommendations) {
                throw new NotFoundException({message: "Er zijn geen opgeslagen aanbevelingen gevonden voor deze student.", status: false});
            }
            return savedRecommendations ? savedRecommendations as SavedRecommendationsDto : new SavedRecommendationsDto([], new Date());

        }catch (error){
            if (error instanceof NotFoundException || error instanceof BadRequestException) {
                throw error;
            }
            throw new InternalServerErrorException({message: "Er is een fout opgetreden bij het ophalen van de opgeslagen aanbevelingen.", status: false});
        }
    }
    private InputValidation(studentId: string, recommendationDto: SaveRecommendationDto[]): void {
        if (!studentId) {
            throw new BadRequestException({message: "Ongeldig student ID.", status: false});
        }
        if (!recommendationDto || recommendationDto.length === 0 || recommendationDto.length > 5) {
            throw new BadRequestException({message: "Het aantal aanbevelingen is ongeldig, het mag niet minder dan 1 en niet meer dan 5 zijn. of de aanbevelingen ontbreken.", status: false});
        }
    }
}