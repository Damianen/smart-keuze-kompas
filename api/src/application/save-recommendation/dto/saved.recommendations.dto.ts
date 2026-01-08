import { SaveRecommendationDto } from "./save-recommendation.dto";

export class SavedRecommendationsDto {
    constructor(
        public readonly recommendations: SaveRecommendationDto[],
        public readonly savedAt: Date,
    ) {}
}