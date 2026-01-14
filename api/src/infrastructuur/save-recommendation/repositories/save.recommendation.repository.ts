import { AbstractSaveRecommendation } from "../../../core/save-recommendations/contract/abstract.save-recommendation";
import { KeuzemoduleAIEntity } from "../../../core/recommender-system/entity/keuzemodule.ai.entity";
import { Injectable, Inject } from "@nestjs/common";
import { Db, ObjectId } from "mongodb";
import { SavedRecommendationsEntity } from "src/core/save-recommendations/entity/saved.recommendations.entity";
@Injectable()
export class SaveRecommendationRepository extends AbstractSaveRecommendation {

    constructor(@Inject("DATABASE_CONNECTION") private readonly dbConnection: Db){ super();}

    async saveRecommendation(studentId: string, recommendation: KeuzemoduleAIEntity[]): Promise<{message: string, status: boolean}> {

        const collection: any = {
            _id: new ObjectId(),
            items: recommendation,
            savedAt: new Date()
        };
        const result = await this.dbConnection.collection('student').updateOne(
            { _id: new ObjectId(studentId) },
            { $push: { recommendations: collection } }
        );
        return {message: "Aanbevelingen zijn succesvol opgeslagen", status: result.modifiedCount > 0};
    }
    async getRecommendations(studentId: string): Promise<SavedRecommendationsEntity | null> {
        const studentCollection = this.dbConnection.collection<SavedRecommendationsEntity>("student");
        const student = await studentCollection.findOne({ _id: new ObjectId(studentId) });

        const collection: any = {
            recommendations: student?.recommendations || [],
            savedAt: student?.savedAt
        };
        return student ? collection : null;
    }
}