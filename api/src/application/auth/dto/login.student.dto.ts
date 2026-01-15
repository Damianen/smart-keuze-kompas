import { IsEmail, IsNotEmpty, Length, Matches, IsDefined } from "class-validator";

export class LoginStudentDto {
    @IsEmail({},{ message: 'Ongeldig e-mailadres' })
    @IsNotEmpty({ message: 'Email is verplicht' })
    @IsDefined({ message: 'Email is verplicht' })
    email: string;

    @IsNotEmpty({ message: 'Wachtwoord is verplicht' })
    @IsDefined({ message: 'Wachtwoord is verplicht' })
    password: string;
}
