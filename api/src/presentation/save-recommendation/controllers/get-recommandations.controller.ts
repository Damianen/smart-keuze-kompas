import { Controller, UseGuards, HttpCode,HttpStatus, Post, Get, Body, ParseArrayPipe } from "@nestjs/common";
import { Throttle, seconds } from "@nestjs/throttler";
import { SaveRecommendationDto } from "src/application/save-recommendation/dto/save-recommendation.dto";
import { SavedRecommendationsDto } from "src/application/save-recommendation/dto/saved.recommendations.dto";
import { SaveRecommendationService } from "src/application/save-recommendation/services/save-recommendation.service";
import { CurrentUser } from "src/infrastructuur/auth/decoder/current-user.decoder";
import { AuthGuard } from "src/infrastructuur/auth/guard/auth.guard";


@Controller('get-recommendations')
export class GetRecommendationsController {

    constructor(private readonly saveRecommendationService: SaveRecommendationService) {}

    @Throttle({default: {ttl: seconds(60), limit: 20}})
    @UseGuards(AuthGuard)
    @Get('get')
    @HttpCode(HttpStatus.OK)
    async getRecommendations(@CurrentUser() student: any): Promise<SavedRecommendationsDto> {
        return this.saveRecommendationService.getRecommendations(student.id);
    }
}