export class SavedRecommendationsEntity {
    constructor(
        public readonly recommendations: unknown[],
        public readonly savedAt: Date,
    ) {}
}