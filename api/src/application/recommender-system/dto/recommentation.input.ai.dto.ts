import {IsNotEmpty, IsString, IsDefined} from 'class-validator';
import { Transform } from 'class-transformer';
import { sanitizeInput } from 'src/utils/utils';
export class RecommendationInputDto {
    @IsNotEmpty()
    @IsString()
    @IsDefined()
    @Transform(({ value }) => sanitizeInput(value))
    student_text: string;
}