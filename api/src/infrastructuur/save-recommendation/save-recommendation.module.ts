import { Module } from "@nestjs/common";
import { SaveRecommendationRepository } from "./repositories/save.recommendation.repository";
import { AbstractSaveRecommendation } from "src/core/save-recommendations/contract/abstract.save-recommendation";
import { DatabaseModule } from "../db/database";

@Module({
    imports: [DatabaseModule],
    providers: [
        {
            provide: AbstractSaveRecommendation,
            useClass: SaveRecommendationRepository
        }
    ],
    exports: [AbstractSaveRecommendation]
})
export class SaveRecommendationModule {}