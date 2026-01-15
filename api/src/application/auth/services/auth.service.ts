import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { Student } from "src/core/auth/entities/student.entitie";
import { AbstractAuthRepository } from "src/core/auth/contract/auth.abstract.repository";
import { CreateStudentDto } from "src/application/auth/dto/create.student.dto";
import { LoginStudentDto } from "src/application/auth/dto/login.student.dto";
import { AbstractHashingService } from "src/core/auth/security/contract/abstract.hashing.service";
import { AbstractTokenService } from "src/core/auth/security/contract/abstract.token.service";
import { AbstractLogger } from "src/core/logger/abstract.logger";


@Injectable()
export class AuthService {
    constructor(
        private readonly authRepository: AbstractAuthRepository, 
        private readonly hashingService: AbstractHashingService,
        private readonly tokenService: AbstractTokenService,
        private readonly logger: AbstractLogger,
    ) {}

    async register(dto: CreateStudentDto): Promise<Student> {
        const existingStudent = await this.authRepository.findByEmail(dto.email);
        if (existingStudent) {
            this.logger.warn(`Registratie poging met bestaand email: ${dto.email}`, {email: dto.email, name: dto.name, surname: dto.surname});
            throw new ConflictException("Email is al in gebruik");
        }
        try{
            dto.password = await this.hashingService.hash(dto.password);
            const student = new Student("", dto.email, dto.surname, dto.password, dto.name, dto.birthDate);
            this.logger.log(`Nieuwe student geregistreerd:`, {email: dto.email, name: dto.name, surname: dto.surname});
            return await this.authRepository.create(student);
        } catch (error) {
            throw new InternalServerErrorException("Error bij registreren");
        }
    }
    async login(dto: LoginStudentDto): Promise<string> {
        const student = await this.authRepository.findByEmail(dto.email);
        if (!student) {
            this.logger.warn(`NotFoundException bij inloggen voor email: ${dto.email}`, {email: dto.email});
            throw new NotFoundException("Student niet gevonden");
        }
        const isPasswordValid = await this.hashingService.compare(dto.password, student.passwordHash);
        if (!isPasswordValid) {
            this.logger.warn(`UnauthorizedException bij inloggen voor email: ${dto.email}`, {email: dto.email});
            throw new UnauthorizedException("Ongeldig wachtwoord of email");
        }
        try{
            // hier maak ik de token aan
            const token = await this.tokenService.signToken({ sub: student.name, email: student.email, id: student.id });
            this.logger.log(`Student ingelogd: ${dto.email}`, {email: dto.email, id: student.id, name: student.name, surname: student.surname});
            return token;
        } catch (error) {
            this.logger.error(`Fout bij inloggen: ${error.message}`, {error: error});
            throw new InternalServerErrorException("Error bij inloggen");
        }
    }
}

