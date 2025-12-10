import {IsEmail, IsString, MinLength, MaxLength, IsDateString, IsNotEmpty, Matches} from "class-validator";


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
    surname: string;

    @IsString()
    @IsNotEmpty({ message: 'Voornaam is verplicht' })
    @MinLength(2)
    name: string;

    @IsDateString( {}, { message: 'Ongeldige datum' })
    @IsNotEmpty({ message: 'Geboortedatum is verplicht' })
    birthDate: Date;
}