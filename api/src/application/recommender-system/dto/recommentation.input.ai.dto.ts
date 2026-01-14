import {IsNotEmpty, IsString} from 'class-validator';
import { Transform } from 'class-transformer';
import { sanitizeInput } from 'src/utils/utils';
export class RecommendationInputDto {
    @IsNotEmpty()
    @IsString()
    @Transform(({ value }) => sanitizeInput(value))
    student_text: string;
}