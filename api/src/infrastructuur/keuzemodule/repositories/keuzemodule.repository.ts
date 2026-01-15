import { Inject, Injectable } from "@nestjs/common";
import { AbstractKeuzeModuleRepository } from "../../../core/keuzemodule/contract/abstract.keuzemodule.repository";
import { KeuzeModule } from "../../../core/keuzemodule/entities/keuzemodule.entitie";
import { Db, ObjectId } from "mongodb";


@Injectable()
export class KeuzeModuleRepository extends AbstractKeuzeModuleRepository {

    constructor(@Inject("DATABASE_CONNECTION") private readonly dbConnection: Db){ super();}

    async getAll(): Promise<KeuzeModule[]> {
        const keuzemoduleCollection = this.dbConnection.collection<KeuzeModule>("vkm");
        return await keuzemoduleCollection.find().toArray();
    }
    async getOne(id: string): Promise<KeuzeModule | null> {
        const keuzemoduleCollection = this.dbConnection.collection<KeuzeModule>("vkm");
        return await keuzemoduleCollection.findOne({ id: Number(id) });
    }
    async getByAttribute(name: string, location?: string, level?: string): Promise<KeuzeModule[]> {

        const filter: any = {}
        filter.$or = [
            {name: {$regex: name, $options: 'i'}}, 
            {description: {$regex: name, $options: 'i'}}, 
            {shortdescription: {$regex: name, $options: 'i'}}
        ];
        if(location){
            filter.location = location;
        }
        if(level){
            filter.level = level;
        }
        const keuzemoduleCollection = await this.dbConnection.collection<KeuzeModule>("vkm").find({ ...filter }).toArray();
        return  keuzemoduleCollection;
    }

}