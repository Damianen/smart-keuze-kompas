import { AbstractSaveRecommendation } from "../../../core/save-recommendations/contract/abstract.save-recommendation";
import { KeuzemoduleAIEntity } from "../../../core/recommender-system/entity/keuzemodule.ai.entity";
import { Injectable, Inject } from "@nestjs/common";
import { Db, ObjectId } from "mongodb";
@Injectable()
export class SaveRecommendationRepository extends AbstractSaveRecommendation {

    constructor(@Inject("DATABASE_CONNECTION") private readonly dbConnection: Db){ super();}

    async saveRecommendation(studentId: string, recommendation: KeuzemoduleAIEntity[]): Promise<{message: string, status: boolean}> {

        const collection: any = {
            recommendations: recommendation,
            savedAt: new Date()
        }
        const result = await this.dbConnection.collection('student').updateOne(
            { _id: new ObjectId(studentId) },
            { $set: collection }
        );
        return {message: "Aanbevelingen zijn succesvol opgeslagen", status: result.modifiedCount > 0};
    }
}