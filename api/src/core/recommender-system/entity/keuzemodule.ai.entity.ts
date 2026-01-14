export class KeuzemoduleAIEntity {
    constructor(
    public readonly _id: string,
    public readonly id: number,
    public readonly name: string,
    public readonly level: string,
    public readonly location: string,
    public readonly estimated_difficulty: number,
    public readonly content_score: number,
    public readonly popularity_score: number,
    public readonly hybrid_score: number,
    public readonly reason_text: string,
    ) {}
}