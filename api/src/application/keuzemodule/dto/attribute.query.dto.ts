import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Transform } from "class-transformer";
import { sanitizeInput } from "../../../utils/utils.js";

export class AttributeQueryDto {
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => sanitizeInput(value))
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