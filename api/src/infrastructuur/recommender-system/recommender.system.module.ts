import { Module } from "@nestjs/common";
import { AbstractRecommenderSystemRepository } from "src/core/recommender-system/contract/abstract.recommender.system.repository";
import { RecommenderSystemRepository } from "./repositories/recommender.system.repository";
import { FastApiClient } from "../fastapiclient/fastapi.client";
import { HttpModule } from "@nestjs/axios";


@Module({
    imports: [HttpModule.register({timeout: 5000, maxRedirects: 5})],
    providers: [
        FastApiClient,
        {
            provide: AbstractRecommenderSystemRepository,
            useClass: RecommenderSystemRepository,
        },
    ],
    exports: [AbstractRecommenderSystemRepository, FastApiClient],
})
export class RecommenderSystemModule {}