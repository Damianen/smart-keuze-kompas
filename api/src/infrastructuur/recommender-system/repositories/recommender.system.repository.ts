import { AbstractRecommenderSystemRepository } from "src/core/recommender-system/contract/abstract.recommender.system.repository";
import { KeuzemoduleAIEntity } from "src/core/recommender-system/entity/keuzemodule.ai.entity";
import { Inject, Injectable } from "@nestjs/common";
import { FastApiClient } from "src/infrastructuur/fastapiclient/fastapi.client";

@Injectable()
export class RecommenderSystemRepository implements AbstractRecommenderSystemRepository {

    constructor(private readonly fastApiClient: FastApiClient) {}

    async getRecommendations(studentInput: string): Promise<KeuzemoduleAIEntity[]> {
        const results = await this.fastApiClient.getRecommendations({ params: { studentInput } });
        return results;
    }

}