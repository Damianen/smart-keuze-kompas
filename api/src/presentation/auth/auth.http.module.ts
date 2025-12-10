import { Module } from "@nestjs/common";
import { AuthController } from "./controllers/auth.controller";
import { AuthModule } from "src/infrastructuur/auth/auth.module";
import { AuthService } from "src/application/auth/services/auth.service";
import { Reflector } from "@nestjs/core";
import { LoggerModule } from "src/infrastructuur/logger/logger.module";

@Module({
    imports: [AuthModule, LoggerModule],
    controllers: [AuthController],
    providers: [AuthService, Reflector],
})
export class AuthHttpModule {}