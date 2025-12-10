import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { Student } from "src/core/auth/entities/student.entitie";
import { AbstractAuthRepository } from "src/core/auth/contract/auth.abstract.repository";
import { CreateStudentDto } from "src/application/auth/dto/create.student.dto";
import { LoginStudentDto } from "src/application/auth/dto/login.student.dto";
import { AbstractHashingService } from "src/core/auth/security/contract/abstract.hashing.service";
import { AbstractTokenService } from "src/core/auth/security/contract/abstract.token.service";


@Injectable()
export class AuthService {
    constructor(
        private readonly authRepository: AbstractAuthRepository, 
        private readonly hashingService: AbstractHashingService,
        private readonly tokenService: AbstractTokenService,
    ) {}

    async register(dto: CreateStudentDto): Promise<Student> {
        const existingStudent = await this.authRepository.findByEmail(dto.email);
        if (existingStudent) {
            throw new ConflictException("Email is al in gebruik");
        }
        try{
            dto.password = await this.hashingService.hash(dto.password);
            const student = new Student("", dto.email, dto.surname, dto.password, dto.name, dto.birthDate);
            return await this.authRepository.create(student);
        } catch (error) {
            throw new InternalServerErrorException("Error bij registreren");
        }
    }
    async login(dto: LoginStudentDto): Promise<string> {
        const student = await this.authRepository.findByEmail(dto.email);
        if (!student) {
            throw new NotFoundException("Student niet gevonden");
        }
        const isPasswordValid = await this.hashingService.compare(dto.password, student.passwordHash);
        if (!isPasswordValid) {
            throw new UnauthorizedException("Ongeldig wachtwoord of email");
        }
        try{
            // hier maak ik de token aan
            const token = await this.tokenService.signToken({ sub: student.name, email: student.email, id: student.id });
            return token;
        } catch (error) {
            throw new InternalServerErrorException("Error bij inloggen");
        }
    }
}

