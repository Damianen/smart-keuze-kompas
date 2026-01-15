import {IsEmail, IsString, MinLength, MaxLength, IsDateString, IsNotEmpty, Matches} from "class-validator";
import { Transform } from 'class-transformer';
import { sanitizeInput } from 'src/utils/utils';

export class CreateStudentDto {
    @IsEmail({},{ message: 'Ongeldig e-mailadres' })
    @IsNotEmpty({ message: 'E-mailadres is verplicht' })
    email: string;

    @IsString()
    @IsNotEmpty({ message: 'Wachtwoord is verplicht' })
    @MinLength(6)
    @MaxLength(30)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, { message: 'Wachtwoord moet minimaal één hoofdletter, één kleine letter en één cijfer bevatten' })
    password: string;

    @IsString()
    @IsNotEmpty({ message: 'Achternaam is verplicht' })
    @MinLength(2)
    @MaxLength(30)
    @Transform(({ value }) => sanitizeInput(value))
    surname: string;

    @IsString()
    @IsNotEmpty({ message: 'Voornaam is verplicht' })
    @MinLength(2)
    @Transform(({ value }) => sanitizeInput(value))
    name: string;

    @IsDateString( {}, { message: 'Ongeldige datum' })
    @IsNotEmpty({ message: 'Geboortedatum is verplicht' })
    birthDate: Date;
}