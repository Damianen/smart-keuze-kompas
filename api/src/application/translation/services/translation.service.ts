import { Injectable } from "@nestjs/common";
import { AbstractLogger } from "src/core/logger/abstract.logger";
import { TranslationRequestDto, TranslationResponseDto } from "../dto/translation.dto";
import translate from 'translate';

@Injectable()
export class TranslationService {
    constructor(private readonly logger: AbstractLogger) {
        translate.engine = 'google';
    }

    async translate(request: TranslationRequestDto): Promise<TranslationResponseDto> {
        const { text, from = 'nl', to = 'en' } = request;

        if (!text || text.trim() === '') {
            return {
                original: text,
                translated: text,
                from,
                to
            };
        }

        try {
            const translated = await translate(text, { from, to });

            this.logger.log('Translation completed', { from, to, textLength: text.length });

            return {
                original: text,
                translated,
                from,
                to
            };
        } catch (error) {
            this.logger.error('Translation failed', { error: error.message, from, to });
            throw error;
        }
    }

    async translateBatch(texts: string[], from: string = 'nl', to: string = 'en'): Promise<string[]> {
        const results: string[] = [];

        for (const text of texts) {
            if (!text || text.trim() === '') {
                results.push(text);
                continue;
            }

            try {
                const translated = await translate(text, { from, to });
                results.push(translated);
            } catch (error) {
                this.logger.error('Batch translation failed for text', { error: error.message });
                results.push(text);
            }
        }

        return results;
    }
}
