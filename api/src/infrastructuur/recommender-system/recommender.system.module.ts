import { Module } from "@nestjs/common";
import { AbstractRecommenderSystemRepository } from "src/core/recommender-system/contract/abstract.recommender.system.repository";
import { RecommenderSystemRepository } from "./repositories/recommender.system.repository";


@Module({
    imports: [],
    providers: [
        {
            provide: AbstractRecommenderSystemRepository,
            useClass: RecommenderSystemRepository,
        },
    ],
    exports: [AbstractRecommenderSystemRepository],
})
export class RecommenderSystemModule {}