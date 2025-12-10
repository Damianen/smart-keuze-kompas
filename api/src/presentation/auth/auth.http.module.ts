import { Module } from "@nestjs/common";
import { AuthController } from "./controllers/auth.controller";
import { AuthModule } from "src/infrastructuur/auth/auth.module";
import { AuthService } from "src/application/auth/services/auth.service";
import { Reflector } from "@nestjs/core";

@Module({
    imports: [AuthModule],
    controllers: [AuthController],
    providers: [AuthService, Reflector],
})
export class AuthHttpModule {}