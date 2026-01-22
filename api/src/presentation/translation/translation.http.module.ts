import { Module } from "@nestjs/common";
import { TranslationController } from "./controllers/translation.controller";
import { TranslationService } from "src/application/translation/services/translation.service";
import { AuthModule } from "src/infrastructuur/auth/auth.module";
import { LoggerModule } from "src/infrastructuur/logger/logger.module";

@Module({
    imports: [AuthModule, LoggerModule],
    controllers: [TranslationController],
    providers: [TranslationService],
})
export class TranslationHttpModule {}
