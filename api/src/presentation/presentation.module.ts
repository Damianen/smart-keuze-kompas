import { Module } from "@nestjs/common";
import { AuthHttpModule } from "./auth/auth.http.module";
import { KeuzemoduleHttpModule } from "./keuzemodule/keuzemodule.http.module";
import { RecommenderSystemHttpModule } from "./recommender-system/recommender.system.http.module";
import { SaveRecommendationHttpModule } from "./save-recommendation/save-recommendation.http.module";
import { TranslationHttpModule } from "./translation/translation.http.module";


@Module({
    imports: [AuthHttpModule, KeuzemoduleHttpModule, RecommenderSystemHttpModule, SaveRecommendationHttpModule, TranslationHttpModule],
})
export class PresentationModule {}