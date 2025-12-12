import { Module } from "@nestjs/common";
import { SeqLogger } from "../logger/seq.logger";
import { AbstractLogger } from "src/core/logger/abstract.logger";

@Module({ 
    providers: [
        {
            provide: AbstractLogger,
            useClass: SeqLogger,
        },
    ], 
    exports: [AbstractLogger] 
})

export class LoggerModule {}