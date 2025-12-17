import { AbstractRecommenderSystemRepository } from "src/core/recommender-system/contract/abstract.recommender.system.repository";
import { KeuzemoduleAIEntity } from "src/core/recommender-system/entity/keuzemodule.ai.entity";
import { Injectable } from "@nestjs/common";
import { FastApiClient } from "src/infrastructuur/fastapiclient/fastapi.client";

@Injectable()
export class RecommenderSystemRepository implements AbstractRecommenderSystemRepository {

    constructor(
        private readonly fastApiClient: FastApiClient,
    ) {}

    async getRecommendations(studentId: string): Promise<KeuzemoduleAIEntity[]> {
        const results = await this.fastApiClient.getRecommendations({ params: { studentId } });

        const entities = results.map(result => new KeuzemoduleAIEntity(
            result.id,
            result.name,
            result.level,
            result.location,
            result.estimatedDifficulty,
            result.contentScore,
            result.popularityScore,
            result.hybridScore,
            result.reasonText,
        ));
        return entities;
    }
}