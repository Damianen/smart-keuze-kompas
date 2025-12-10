import { AuthService } from "src/application/auth/services/auth.service";
import { Body, Controller, Get, Post, Res, UseGuards } from "@nestjs/common";
import { CreateStudentDto } from "../../../application/auth/dto/create.student.dto";
import { LoginStudentDto } from "../../../application/auth/dto/login.student.dto";
import type { Response } from "express";
import { AllowAnonymous } from "../../../infrastructuur/auth/guard/allowanonymous.decoder";
import { AuthGuard } from "../../../infrastructuur/auth/guard/auth.guard";
import { HttpCode } from "@nestjs/common";
import { HttpStatus } from "@nestjs/common";
import { CurrentUser } from "../../../infrastructuur/auth/decoder/current-user.decoder";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @AllowAnonymous()
    @HttpCode(HttpStatus.CREATED)
    @Post('register')
    async register(@Body() createStudentDto: CreateStudentDto): Promise<{ success: boolean; message: string }> {
        await this.authService.register(createStudentDto);
        return { success: true, message: 'Registreren gelukt' };
    }
    @AllowAnonymous()
    @HttpCode(HttpStatus.OK)
    @Post('login')
    async login(@Body() loginStudentDto: LoginStudentDto, @Res({ passthrough: true }) res: Response): Promise<{ success: boolean; message: string }> {
        const result = await this.authService.login(loginStudentDto);
        res.cookie('token', result, { httpOnly: true, sameSite: 'none', secure: true, maxAge: 3600000 });  // met rekenmachine berekend (24 * 60 * 60 * 1000) = 3600000 ms = 1 uur
        return { success: true, message: 'Inloggen gelukt' };
    }
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @Post('logout')
    async logout(@Res({ passthrough: true }) res: Response): Promise<{ success: boolean; message: string }> {
        res.clearCookie('token', { httpOnly: true, sameSite: 'none', secure: true, path: '/' });
        return { success: true, message: 'Uitloggen gelukt' };
    }

    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @Get('user')
    async getUser(@CurrentUser() user: any): Promise<any> {
        return { user, success: true, message: 'Gebruiker opgehaald'};
    }
}