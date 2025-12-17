import { Controller, Get, HttpCode, HttpStatus, Param, Query } from "@nestjs/common";
import { KeuzeModuleDto } from "src/application/keuzemodule/dto/keuzemodule.dto";
import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/infrastructuur/auth/guard/auth.guard";
import { KeuzeModuleService } from "src/application/keuzemodule/services/keuzemodule.service";
import { AttributeQueryDto } from "src/application/keuzemodule/dto/attribute.query.dto";
import { Throttle, seconds } from "@nestjs/throttler";

@Controller('keuzemodules')
export class KeuzeModuleController {
    constructor(private readonly keuzeModuleService: KeuzeModuleService) {}

    @Throttle({default: {ttl: seconds(60), limit: 50}})
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @Get('getAll')
    async findAll(): Promise<KeuzeModuleDto[]> {
        return await this.keuzeModuleService.getAll();
    }
    @Throttle({default: {ttl: seconds(60), limit: 50}})

    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @Get('getOne/:id')
    async findOne(@Param('id') id: string): Promise<KeuzeModuleDto | null> {
        return await this.keuzeModuleService.getOne(id);
    }
    @Throttle({default: {ttl: seconds(60), limit: 50}})
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @Get('search')
    async findModulesByAttribute(@Query() query: AttributeQueryDto): Promise<KeuzeModuleDto[]> {
        return await this.keuzeModuleService.getByAttribute(query.name, query.location, query.level);
    }
}