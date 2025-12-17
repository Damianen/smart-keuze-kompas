import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class AttributeQueryDto {
    @IsString()
    @IsNotEmpty()
    name: string;
    @IsOptional()
    @IsString()
    location?: string;
    @IsOptional()
    @IsString()
    level?: string;
}