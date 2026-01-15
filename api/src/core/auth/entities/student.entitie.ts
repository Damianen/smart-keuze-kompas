export class Student {
    id: string;
    name: string;
    birthDate: string;
    email: string;
    surname: string;
    passwordHash: string;
    constructor(id: string, email: string, surname: string, passwordHash: string, name: string, birthDate: string) {
        this.id = id;
        this.email = email;
        this.surname = surname;
        this.passwordHash = passwordHash;
        this.name = name;
        this.birthDate = birthDate;
    }
}