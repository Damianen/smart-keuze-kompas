import { Student } from "src/core/auth/entities/student.entitie";
import { AbstractAuthRepository } from "../../../core/auth/contract/auth.abstract.repository";
import { Inject, Injectable } from "@nestjs/common";
import { Db } from "mongodb";


@Injectable()
export class AuthRepository extends AbstractAuthRepository {

    constructor(@Inject("DATABASE_CONNECTION") private readonly dbConnection: Db){ super();}

    async findByEmail(email: string): Promise<Student | null> {
        const studentCollection = this.dbConnection.collection<Student>("student");
        const student = await studentCollection.findOne({ email: { $eq: email } });
        return student ? new Student(student._id.toString(), student.email, student.surname, student.passwordHash, student.name, student.birthDate) : null;
    }

    async create(student: Student): Promise<Student> {
        const studentCollection = this.dbConnection.collection<Student>("student");
        const result = await studentCollection.insertOne(student);
        return new Student(result.insertedId.toString(), student.email, student.surname, student.passwordHash, student.name, student.birthDate);
    }
}