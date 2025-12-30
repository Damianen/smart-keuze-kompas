import { KeuzemoduleAIDto } from "src/application/recommender-system/dto/keuzemodule.ai.dto";
import {KeuzeModule} from "../../../core/keuzemodule/entities/keuzemodule.entitie";
import {KeuzeModuleDto } from "../dto/keuzemodule.dto";
import { KeuzemoduleAIEntity } from "src/core/recommender-system/entity/keuzemodule.ai.entity";

export class KeuzeModuleMapper {
    static toDTO(entity: KeuzeModule): KeuzeModuleDto  {
        return {
            id: entity.id,
            name: entity.name,
            description: entity.description,
            studycredit: entity.studycredit,
            location: entity.location,
            shortdescription: entity.shortdescription,
            level: entity.level,
            content: entity.content,
            learningoutcomes: entity.learningoutcomes,
        };
    }
    static toDTOArray(entities: KeuzeModule[]): KeuzeModuleDto[] {
        const dtos: KeuzeModuleDto[] = [];
        for (const entity of entities) {
            dtos.push(this.toDTO(entity));
        }
        return dtos;
    }
}