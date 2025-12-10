import { Inject, Injectable } from "@nestjs/common";
import { AbstractKeuzeModuleRepository } from "../../../core/keuzemodule/contract/abstract.keuzemodule.repository";
import { KeuzeModule } from "../../../core/keuzemodule/entities/keuzemodule.entitie";
import { Db, ObjectId } from "mongodb";

@Injectable()
export class KeuzeModuleRepository extends AbstractKeuzeModuleRepository {

    constructor(@Inject("DATABASE_CONNECTION") private readonly dbConnection: Db){ super();}

    async getAll(): Promise<KeuzeModule[]> {
        const vkmCollection = this.dbConnection.collection<KeuzeModule>("vkm");
        return await vkmCollection.find().toArray();
    }
    async getOne(id: string): Promise<KeuzeModule | null> {
        const vkmCollection = this.dbConnection.collection<KeuzeModule>("vkm");
        return await vkmCollection.findOne({ _id: new ObjectId(id) });
    }
}