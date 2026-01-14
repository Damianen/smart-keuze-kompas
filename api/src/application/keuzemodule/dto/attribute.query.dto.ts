import { IsDefined, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Transform } from "class-transformer";
import { sanitizeInput } from "../../../utils/utils.js";

export class AttributeQueryDto {
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => sanitizeInput(value))
    @IsDefined({message: 'Naam is verplicht'})
    name: string;
    @IsOptional()
    @IsString()
    @Transform(({ value }) => sanitizeInput(value))
    location?: string;
    @IsOptional()
    @IsString()
    @Transform(({ value }) => sanitizeInput(value))
    level?: string;
}