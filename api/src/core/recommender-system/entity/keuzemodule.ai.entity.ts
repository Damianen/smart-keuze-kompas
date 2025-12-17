export class KeuzemoduleAIEntity {
    constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly level: string,
    public readonly location: string,
    public readonly estimatedDifficulty: number,
    public readonly contentScore: number,
    public readonly popularityScore: number,
    public readonly hybridScore: number,
    public readonly reasonText: string,
    ) {}
}