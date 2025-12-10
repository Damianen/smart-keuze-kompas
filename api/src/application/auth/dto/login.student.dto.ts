import { IsEmail, IsNotEmpty, Length, Matches } from "class-validator";

export class LoginStudentDto {
    @IsEmail({},{ message: 'Ongeldig e-mailadres' })
    @IsNotEmpty({ message: 'Email is verplicht' })
    email: string;

    @IsNotEmpty({ message: 'Wachtwoord is verplicht' })
    password: string;
}
