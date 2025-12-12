
export abstract class AbstractTokenService {
    abstract signToken(payload: object): Promise<string>;
    abstract verifyToken(token: string, secret?: string): Promise<any>;
}