import { AbstractRecommenderSystemRepository } from "src/core/recommender-system/contract/abstract.recommender.system.repository";
import { RecommendationInputDto } from "../dto/recommentation.input.ai.dto";
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { KeuzemoduleAIDto } from "../dto/keuzemodule.ai.dto";
import { KeuzemoduleAIMapper } from "../mapper/keuzemodule.ai.mapper";
import { AbstractLogger } from "src/core/logger/abstract.logger";


@Injectable()
export class RecommenderSystemService {
    constructor(
        private readonly recommenderSystemRepository: AbstractRecommenderSystemRepository,
        private readonly logger: AbstractLogger,
    ) {}
    async getRecommendations(dto: RecommendationInputDto): Promise<KeuzemoduleAIDto[]> {
        if (!dto.student_text){
            this.logger.warn('De input voor aanbevelingen is leeg.');
            throw new BadRequestException('De input voor aanbevelingen mag niet leeg zijn.');
        }
        try {
            const recommendations = await this.recommenderSystemRepository.getRecommendations(dto.student_text);
            if (!recommendations || recommendations.length === 0) {
                throw new NotFoundException('Geen aanbevelingen gevonden voor de gegeven input.');
            }
            const mappedRecommendations = KeuzemoduleAIMapper.toDtoList(recommendations);
            if (!mappedRecommendations) {
                throw new NotFoundException('Geen aanbevelingen gevonden na mapping.');
            }
            return mappedRecommendations;
        }
        catch (error) {
            if (error instanceof NotFoundException) {
                this.logger.warn('Geen aanbevelingen gevonden.', error);
                throw error;
            }
            this.logger.error('Fout bij het ophalen van aanbevelingen.', error);
            throw new InternalServerErrorException('Er is een fout opgetreden bij het ophalen van aanbevelingen.', error.message);
        }
    }
}