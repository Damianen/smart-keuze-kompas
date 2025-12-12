
export abstract class AbstractLogger {
    abstract log(message: string, meta?: Record<string, any>): void;
    abstract error(message: string, meta?: Record<string, any>): void;
    abstract warn(message: string, meta?: Record<string, any>): void;
}