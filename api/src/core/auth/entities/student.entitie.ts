export class Student {
    id: string;
    name: string;
    birthDate: Date;
    email: string;
    surname: string;
    passwordHash: string;
    constructor(id: string, email: string, surname: string, passwordHash: string, name: string, birthDate: Date) {
        this.id = id;
        this.email = email;
        this.surname = surname;
        this.passwordHash = passwordHash;
        this.name = name;
        this.birthDate = birthDate;
    }
}