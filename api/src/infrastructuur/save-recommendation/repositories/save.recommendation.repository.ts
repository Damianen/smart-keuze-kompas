import { AbstractSaveRecommendation } from "../../../core/save-recommendations/contract/abstract.save-recommendation";
import { KeuzemoduleAIEntity } from "../../../core/recommender-system/entity/keuzemodule.ai.entity";
import { Injectable, Inject } from "@nestjs/common";
import { Db, ObjectId } from "mongodb";
import { SavedRecommendationsEntity } from "src/core/save-recommendations/entity/saved.recommendations.entity";
import { UpdateFilter } from "mongodb";


export interface RecommendationItem {
  _id: string;
  items: KeuzemoduleAIEntity[];
  savedAt: Date;
}

export interface StudentDocument {
  _id: ObjectId;
  recommendations: RecommendationItem[];
}
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
    async deleteRecommendations(studentId: string, moduleId: string, collectionId: string): Promise<{message: string, status: boolean}> {
        console.log(await this.dbConnection.collection<SavedRecommendationsEntity>('student').findOne({ _id: new ObjectId(studentId), recommendations: { $elemMatch: { _id: new ObjectId(collectionId) } } }));
        const result = await this.dbConnection.collection<StudentDocument>('student').updateOne(
            { _id: new ObjectId(studentId), recommendations: { $elemMatch: { _id: new ObjectId(collectionId) } } },
            { $pull: { "recommendations.$.items": { _id: moduleId } } },
            
        );
        return {message: "Aanbevelingen zijn succesvol verwijderd", status: result.modifiedCount > 0};
    }
    async deleteCollection(studentId: string, collectionId: string): Promise<{message: string, status: boolean}> {
        const result =  await this.dbConnection.collection<SavedRecommendationsEntity>('student').updateOne(
            { _id: new ObjectId(studentId), recommendations: { $elemMatch: { _id: new ObjectId(collectionId) } } },
            { $pull: { recommendations: { _id: new ObjectId(collectionId) } } }
        );
        return {message: "Collectie is succesvol verwijderd", status: result.modifiedCount > 0};
    }
}