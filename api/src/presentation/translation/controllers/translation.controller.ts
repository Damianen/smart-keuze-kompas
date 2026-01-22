import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards } from "@nestjs/common";
import { TranslationService } from "src/application/translation/services/translation.service";
import { TranslationRequestDto, TranslationResponseDto } from "src/application/translation/dto/translation.dto";
import { AuthGuard } from "src/infrastructuur/auth/guard/auth.guard";
import { Throttle, seconds } from "@nestjs/throttler";

@Controller('translation')
export class TranslationController {
    constructor(private readonly translationService: TranslationService) {}

    @Throttle({default: {ttl: seconds(60), limit: 100}})
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @Post('translate')
    async translate(@Body() request: TranslationRequestDto): Promise<TranslationResponseDto> {
        return await this.translationService.translate(request);
    }

    @Throttle({default: {ttl: seconds(60), limit: 50}})
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @Post('translate-batch')
    async translateBatch(@Body() request: { texts: string[], from?: string, to?: string }): Promise<{ translations: string[] }> {
        const translations = await this.translationService.translateBatch(
            request.texts,
            request.from || 'nl',
            request.to || 'en'
        );
        return { translations };
    }
}
