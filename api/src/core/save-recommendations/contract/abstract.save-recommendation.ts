import { KeuzemoduleAIEntity } from "../../../core/recommender-system/entity/keuzemodule.ai.entity";
import { SavedRecommendationsEntity } from "../entity/saved.recommendations.entity";

export abstract class AbstractSaveRecommendation {
    abstract saveRecommendation(studentId: string, recommendation: KeuzemoduleAIEntity[]): Promise<{message: string, status: boolean}>;
    abstract getRecommendations(studentId: string): Promise<SavedRecommendationsEntity | null>;
    abstract deleteRecommendations(studentId: string, moduleId: string, collectionId: string): Promise<{message: string, status: boolean}>;
    abstract deleteCollection(studentId: string, collectionId: string): Promise<{message: string, status: boolean}>;
}