
export class StudentResponseDto {
    id: string;
    email: string;
    username: string;
    name: string;
    birthDate: Date;

    constructor(id: string, email: string, username: string, name: string, birthDate: Date) {
        this.id = id;
        this.email = email;
        this.username = username;
        this.name = name;
        this.birthDate = birthDate;
    }
}