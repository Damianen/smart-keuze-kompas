import { Student } from "src/core/auth/entities/student.entitie";


export abstract class AbstractAuthRepository{
    abstract findByEmail(email: string): Promise<Student | null>;
    abstract create(student: Student): Promise<Student>;
}