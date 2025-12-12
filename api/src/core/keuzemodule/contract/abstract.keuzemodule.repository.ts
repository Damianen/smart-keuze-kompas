import { KeuzeModule } from "src/core/keuzemodule/entities/keuzemodule.entitie";


export abstract class AbstractKeuzeModuleRepository {

    abstract getAll(): Promise<KeuzeModule[]>;
    abstract getOne(id: string): Promise<KeuzeModule | null>;
}