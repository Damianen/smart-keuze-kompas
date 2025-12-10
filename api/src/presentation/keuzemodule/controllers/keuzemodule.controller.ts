import { Controller, Get, HttpCode, HttpStatus, Param } from "@nestjs/common";
import { KeuzeModuleDto } from "src/application/keuzemodule/dto/keuzemodule.dto";
import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/infrastructuur/auth/guard/auth.guard";
import { KeuzeModuleService } from "src/application/keuzemodule/services/keuzemodule.service";

@Controller('keuzemodules')
export class KeuzeModuleController {
    constructor(private readonly keuzeModuleService: KeuzeModuleService) {}

    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @Get()
    async findAll(): Promise<KeuzeModuleDto[]> {
        return await this.keuzeModuleService.getAll();
    }
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @Get(':id')
    async findOne(@Param('id') id: string): Promise<KeuzeModuleDto | null> {
        return await this.keuzeModuleService.getOne(id);
    }
}