import { Module } from "@nestjs/common";
import { RecommenderSystemController } from "./controllers/recommender.system.controller";
import { RecommenderSystemService } from "src/application/recommender-system/services/recommendersystem.service";
import { RecommenderSystemModule } from "src/infrastructuur/recommender-system/recommender.system.module";
import { AuthModule } from "src/infrastructuur/auth/auth.module";
import { LoggerModule } from "src/infrastructuur/logger/logger.module";

@Module({
    imports: [RecommenderSystemModule, AuthModule, LoggerModule],
    controllers: [RecommenderSystemController],
    providers: [RecommenderSystemService],
})
export class RecommenderSystemHttpModule {}
