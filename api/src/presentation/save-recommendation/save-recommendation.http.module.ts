import { Module } from "@nestjs/common";
import { SaveRecommendationService } from "src/application/save-recommendation/services/save-recommendation.service";
import { AuthModule } from "src/infrastructuur/auth/auth.module";
import { LoggerModule } from "src/infrastructuur/logger/logger.module";
import { SaveRecommendationController } from "../save-recommendation/controllers/save-recommendation.controller"
import { SaveRecommendationModule } from "src/infrastructuur/save-recommendation/save-recommendation.module";
import { GetRecommendationsController } from "./controllers/get-recommandations.controller";

@Module({
    imports: [SaveRecommendationModule, AuthModule, LoggerModule],
    controllers: [SaveRecommendationController, GetRecommendationsController],
    providers: [SaveRecommendationService],
    exports: [SaveRecommendationService]
})
export class SaveRecommendationHttpModule {}