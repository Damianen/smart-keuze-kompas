import { AbstractTokenService } from "src/core/auth/security/contract/abstract.token.service";
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Allow_Anonymous } from "./allowanonymous.decoder";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly tokenService: AbstractTokenService, private readonly reflector: Reflector) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {

        const AllowAnonymous = this.reflector.getAllAndOverride<boolean>(Allow_Anonymous, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (AllowAnonymous) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const token = request.cookies?.token; // Haal de token op uit de cookies
        if (!token) {
            throw new UnauthorizedException("Geen token gevonden");
        }
        try{
            const payload = await this.tokenService.verifyToken(token, process.env.JWT_SECRET);
            // Voeg de payload toe aan het request object voor later gebruik
            request.user = payload;
        }catch(error){
            throw new UnauthorizedException("Ongeldige token");
        }
        return true;
    }
}