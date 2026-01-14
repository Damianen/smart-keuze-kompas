import { Controller, UseGuards, HttpCode,HttpStatus, Post, Param, Delete} from "@nestjs/common";
import { Throttle, seconds } from "@nestjs/throttler";
import { SaveRecommendationService } from "src/application/save-recommendation/services/save-recommendation.service";
import { CurrentUser } from "src/infrastructuur/auth/decoder/current-user.decoder";
import { AuthGuard } from "src/infrastructuur/auth/guard/auth.guard";


@Controller('delete-recommendations')
export class DeleteRecommendationsController {

    constructor(private readonly saveRecommendationService: SaveRecommendationService) {}

    @Throttle({default: {ttl: seconds(60), limit: 20}})
    @UseGuards(AuthGuard)
    @Delete('delete/:collectionId/:moduleId')
    @HttpCode(HttpStatus.OK)
    async deleteRecommendations(@CurrentUser() student: any, @Param('moduleId') moduleId: string, @Param('collectionId') collectionId: string): Promise<{message: string, status: boolean}> {
        return this.saveRecommendationService.deleteRecommendations(student.id, moduleId, collectionId);
    }
    
    @Throttle({default: {ttl: seconds(60), limit: 20}})
    @UseGuards(AuthGuard)
    @Delete('delete-collection/:collectionId')
    @HttpCode(HttpStatus.OK)
    async deleteCollection(@CurrentUser() student: any, @Param('collectionId') collectionId: string): Promise<{message: string, status: boolean}> {
        return this.saveRecommendationService.deleteCollection(student.id, collectionId);
    }
}