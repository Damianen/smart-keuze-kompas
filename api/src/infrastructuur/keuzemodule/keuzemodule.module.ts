import { Module } from "@nestjs/common";
import { KeuzeModuleRepository } from "src/infrastructuur/keuzemodule/repositories/keuzemodule.repository";
import { AbstractKeuzeModuleRepository } from "src/core/keuzemodule/contract/abstract.keuzemodule.repository";
import { DatabaseModule } from "../db/database";

@Module({
    imports: [DatabaseModule],    
    providers: [
        {
            provide: AbstractKeuzeModuleRepository,
            useClass: KeuzeModuleRepository,
        },
    ],
    exports: [AbstractKeuzeModuleRepository],
})

export class KeuzemoduleModule {}