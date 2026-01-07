import { KeuzemoduleAIDto } from "src/application/recommender-system/dto/keuzemodule.ai.dto";
import { KeuzemoduleAIEntity } from "src/core/recommender-system/entity/keuzemodule.ai.entity";
import { SaveRecommendationDto } from "../dto/save-recommendation.dto";


export class KeuzemoduleRecommendationMapper {

    static toEntity(dto: SaveRecommendationDto[]): KeuzemoduleAIEntity[] {
        const entities: KeuzemoduleAIEntity[] = [];
        for (const item of dto) {
            entities.push({
                id: item.id,
                name: item.name,
                location: item.location,
                level: item.level,
                hybrid_score: item.hybrid_score,
                reason_text: item.reason_text,
                popularity_score: item.popularity_score,
                content_score: item.content_score,
                estimated_difficulty: item.estimated_difficulty,
            });
        }
        return entities;
    }
}