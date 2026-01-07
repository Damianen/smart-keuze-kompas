import { KeuzemoduleAIEntity } from '../../../core/recommender-system/entity/keuzemodule.ai.entity';
import { KeuzemoduleAIDto } from '../dto/keuzemodule.ai.dto';

export class KeuzemoduleAIMapper {
    static toDto(entity: KeuzemoduleAIEntity): KeuzemoduleAIDto {
        return new KeuzemoduleAIDto(
            entity.id,
            entity.name,
            entity.level,
            entity.location,
            entity.estimated_difficulty,
            entity.content_score,
            entity.popularity_score,
            entity.hybrid_score,
            entity.reason_text
        );
    }
    static toDtoList(entities: KeuzemoduleAIEntity[]): KeuzemoduleAIDto[] {
        const dtos: KeuzemoduleAIDto[] = [];
        for (const entity of entities) {
            dtos.push(this.toDto(entity));
        }
        return dtos;
    }
}