import { KeuzemoduleAIEntity } from "../../../core/recommender-system/entity/keuzemodule.ai.entity";

export abstract class AbstractSaveRecommendation {
    abstract saveRecommendation(studentId: string, recommendation: KeuzemoduleAIEntity[]): Promise<{message: string, status: boolean}>;
}