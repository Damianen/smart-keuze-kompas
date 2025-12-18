import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query } from "@nestjs/common";
import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/infrastructuur/auth/guard/auth.guard";
import { Throttle, seconds } from "@nestjs/throttler";
import { RecommenderSystemService } from "src/application/recommender-system/services/recommendersystem.service";
import { RecommendationInputDto } from "src/application/recommender-system/dto/recommentation.input.ai.dto";
import { KeuzemoduleAIDto } from "src/application/recommender-system/dto/keuzemodule.ai.dto";

@Controller('recommender-system')
export class RecommenderSystemController {
    constructor(private readonly recommenderSystemService: RecommenderSystemService) {}

    @Throttle({default: {ttl: seconds(60), limit: 50}})
    @UseGuards(AuthGuard)
    @Post('recommendations')
    @HttpCode(HttpStatus.OK)
    async getRecommendations(@Body() dto: RecommendationInputDto): Promise<KeuzemoduleAIDto[]> {
        return this.recommenderSystemService.getRecommendations(dto);
    }
}