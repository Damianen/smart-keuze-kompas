import { IsNotEmpty, IsDefined, IsString, IsOptional } from "class-validator";

export class TranslationRequestDto {
    @IsNotEmpty()
    @IsDefined()
    @IsString()
    text: string;

    @IsOptional()
    @IsString()
    from?: string = 'nl';

    @IsOptional()
    @IsString()
    to?: string = 'en';
}

export class TranslationResponseDto {
    original: string;
    translated: string;
    from: string;
    to: string;
}
