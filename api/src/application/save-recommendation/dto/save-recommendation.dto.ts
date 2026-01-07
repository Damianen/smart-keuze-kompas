import { IsNotEmpty, IsNumber, IsString} from 'class-validator';

export class SaveRecommendationDto {

    @IsNotEmpty({message: 'ID mag niet leeg zijn'})
    @IsNumber({}, {message: 'ID moet een nummer zijn'})
    id: number;

    @IsNotEmpty({message: 'Naam mag niet leeg zijn'})
    @IsString({message: 'Naam moet een string zijn'})
    name: string;

    @IsNotEmpty({message: 'Locatie mag niet leeg zijn'})
    @IsString({message: 'Locatie moet een string zijn'})
    location: string;

    @IsNotEmpty({message: 'Niveau mag niet leeg zijn'})
    @IsString({message: 'Niveau moet een string zijn'})
    level: string;

    @IsNotEmpty({message: 'Hybride score mag niet leeg zijn'})
    @IsNumber({}, {message: 'Hybride score moet een nummer zijn'})
    hybrid_score: number;

    @IsNotEmpty({message: 'Reden tekst mag niet leeg zijn'})
    @IsString({message: 'Reden tekst moet een string zijn'})
    reason_text: string;

    @IsNotEmpty({message: 'Populariteitsscore mag niet leeg zijn'})
    @IsNumber({}, {message: 'Populariteitsscore moet een nummer zijn'})
    popularity_score: number;

    @IsNotEmpty({message: 'Inhoudsscore mag niet leeg zijn'})
    @IsNumber({}, {message: 'Inhoudsscore moet een nummer zijn'})
    content_score: number;

    @IsNotEmpty({message: 'Geschatte moeilijkheid mag niet leeg zijn'})
    @IsNumber({}, {message: 'Geschatte moeilijkheid moet een nummer zijn'})
    estimated_difficulty: number;
}