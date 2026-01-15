import { SaveRecommendationDto } from "./save-recommendation.dto";

export class CollectionDto {
    constructor(
        public readonly _id: string,
        public readonly items: SaveRecommendationDto[],
        public readonly savedAt: Date,
    ) {}
}
