import { KeuzemoduleAIEntity } from "../entity/keuzemodule.ai.entity";

export abstract class AbstractRecommenderSystemRepository {
    abstract getRecommendations(userInput: string): Promise<KeuzemoduleAIEntity[]>;

}