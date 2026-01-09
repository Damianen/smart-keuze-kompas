import {IsNotEmpty, IsString} from 'class-validator';

export class RecommendationInputDto {
    @IsNotEmpty()
    @IsString()
    student_text: string;
}