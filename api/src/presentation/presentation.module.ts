import { Module } from "@nestjs/common";
import { AuthHttpModule } from "./auth/auth.http.module";
import { KeuzemoduleHttpModule } from "./keuzemodule/keuzemodule.http.module";


@Module({
    imports: [AuthHttpModule, KeuzemoduleHttpModule],
})
export class PresentationModule {}