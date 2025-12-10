import { Module } from "@nestjs/common";
import { AuthHttpModule } from "./auth/auth.http.module";


@Module({
    imports: [AuthHttpModule],
})
export class PresentationModule {}