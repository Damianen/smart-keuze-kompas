import { Module } from "@nestjs/common";
import { KeuzeModuleController } from "./controllers/keuzemodule.controller";
import { KeuzeModuleService } from "src/application/keuzemodule/services/keuzemodule.service";
import { KeuzemoduleModule } from "src/infrastructuur/keuzemodule/keuzemodule.module";
import { AuthModule } from "src/infrastructuur/auth/auth.module";

@Module({
    imports: [KeuzemoduleModule, AuthModule],
    controllers: [KeuzeModuleController],
    providers: [KeuzeModuleService],
})
export class KeuzemoduleHttpModule {}