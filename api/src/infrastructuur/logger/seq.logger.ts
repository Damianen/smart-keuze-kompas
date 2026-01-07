import { Injectable } from "@nestjs/common";
import { AbstractLogger } from "src/core/logger/abstract.logger";
import winston from "winston";
import { SeqTransport } from "@datalust/winston-seq";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class SeqLogger extends AbstractLogger {

    public logger: winston.Logger;

    constructor(config: ConfigService) {
        super();
        
        const seqUrl = config.get<string>('SEQ_BASE_URL', 'http://localhost:5341');
        const apiKey = config.get<string>('SEQ_API_KEY', '');
        this.logger = winston.createLogger({
            level: "info",
            format: winston.format.combine(
                winston.format.errors({ stack: true }),
                winston.format.timestamp(),
                winston.format.metadata({ fillExcept: ["message", "level", "timestamp", "label"] }),
                winston.format.json(),
            ),
            defaultMeta: { application: "keuze-module-kompas" },
            transports: [
                new winston.transports.Console({
                format: winston.format.simple(),
                }),
                new SeqTransport({
                    serverUrl: seqUrl,
                    apiKey: apiKey,
                    onError: (e) => {
                        console.error("Seq Transport Error:", e);
                    },
                    handleExceptions: true,
                    handleRejections: true,
                }),
            ],
        });
    }

    log(message: string, meta?: Record<string, any>): void {
        this.logger.info(message, meta);
    }
    warn(message: string, meta?: Record<string, any>): void {
        this.logger.warn(message, meta);
    }
    error(message: string, meta?: Record<string, any>): void {
        this.logger.error(message, meta);
    }
}
