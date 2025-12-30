import { Module } from "@nestjs/common";
import { AuthHttpModule } from "./auth/auth.http.module";
import { KeuzemoduleHttpModule } from "./keuzemodule/keuzemodule.http.module";
import { RecommenderSystemHttpModule } from "./recommender-system/recommender.system.http.module";
import { SaveRecommendationHttpModule } from "./save-recommendation/save-recommendation.http.module";


@Module({
    imports: [AuthHttpModule, KeuzemoduleHttpModule, RecommenderSystemHttpModule, SaveRecommendationHttpModule],
})
export class PresentationModule {}