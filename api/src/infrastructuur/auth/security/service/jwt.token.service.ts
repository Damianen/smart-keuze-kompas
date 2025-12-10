import {JwtService} from "@nestjs/jwt";
import { Injectable } from "@nestjs/common";
import { AbstractTokenService } from "src/core/auth/security/contract/abstract.token.service";

@Injectable()
export class JwtTokenService extends AbstractTokenService {
    constructor(private readonly jwtService: JwtService) {
        super();
    }

    async signToken(payload: object): Promise<string> {
        return await this.jwtService.signAsync(payload);
    }

    async verifyToken(token: string, secret?: string): Promise<any> {
        return await this.jwtService.verifyAsync(token, {secret: secret});
    }
}