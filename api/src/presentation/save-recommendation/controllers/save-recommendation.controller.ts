import { Controller, UseGuards, HttpCode,HttpStatus, Post, Body, ParseArrayPipe } from "@nestjs/common";
import { Throttle, seconds } from "@nestjs/throttler";
import { SaveRecommendationDto } from "src/application/save-recommendation/dto/save-recommendation.dto";
import { SaveRecommendationService } from "src/application/save-recommendation/services/save-recommendation.service";
import { CurrentUser } from "src/infrastructuur/auth/decoder/current-user.decoder";
import { AuthGuard } from "src/infrastructuur/auth/guard/auth.guard";

@Controller('save-recommendation')
export class SaveRecommendationController {
    constructor(private readonly saveRecommendationService: SaveRecommendationService) {}

    @Throttle({default: {ttl: seconds(60), limit: 20}})
    @UseGuards(AuthGuard)
    @Post('save')
    @HttpCode(HttpStatus.OK)
    async saveRecommendation(@CurrentUser() student: any, @Body(new ParseArrayPipe({ items: SaveRecommendationDto })) dto: SaveRecommendationDto[]): Promise<{message: string, status: boolean}> {
        return this.saveRecommendationService.saveRecommendation(student.id, dto);
    }
}