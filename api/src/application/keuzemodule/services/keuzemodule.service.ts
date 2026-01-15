import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { KeuzeModule } from "src/core/keuzemodule/entities/keuzemodule.entitie";
import { AbstractKeuzeModuleRepository } from "src/core/keuzemodule/contract/abstract.keuzemodule.repository";
import { AbstractLogger } from "src/core/logger/abstract.logger";
import { escapeRegExp, normalizeString } from "src/utils/utils";
import { KeuzeModuleDto } from "../dto/keuzemodule.dto";
import { KeuzeModuleMapper } from "../keuzemodulemapper/keuzemodule.mapper";
@Injectable()
export class KeuzeModuleService {
    constructor(private readonly keuzeModuleRepository: AbstractKeuzeModuleRepository, private readonly logger: AbstractLogger) {}

    async getAll(): Promise<KeuzeModuleDto[]> {
        try{
           const keuzeModules = await this.keuzeModuleRepository.getAll();
           if(!keuzeModules){
                throw new NotFoundException("Geen Keuze modules gevonden");
           }
           const keuzeModuleDto = KeuzeModuleMapper.toDTOArray(keuzeModules);
           return keuzeModuleDto;
        } catch (error) {
            if (error instanceof NotFoundException) {
                this.logger.warn('Geen keuze modules gevonden.', {error});
                throw error;
            }
            this.logger.error('Fout bij het ophalen van keuze modules.', {error});
            throw new InternalServerErrorException("Er is een fout opgetreden");
        }
    }
    async getOne(id: string): Promise<KeuzeModuleDto | null> {
        if (!id) {
            throw new BadRequestException("Ongeldig ID");
        }
        try{
            const keuzeModule = await this.keuzeModuleRepository.getOne(id);
            if (!keuzeModule) {
                throw new NotFoundException("Keuze module niet gevonden");
            }
            const keuzeModuleDto = KeuzeModuleMapper.toDTO(keuzeModule);
            this.logger.log(`Keuze module opgehaald: ${keuzeModule.id}`, {id: keuzeModule.id, name: keuzeModule.name, code: keuzeModule.description, credits: keuzeModule.studycredit, location: keuzeModule.location, shortdescription: keuzeModule.shortdescription});
            return keuzeModuleDto;
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof BadRequestException) {
                this.logger.warn('Fout bij het ophalen van de keuze module.', {error, id});
                throw error;
            }
            throw new InternalServerErrorException("Er is een fout opgetreden??");
        }
    }
    async getByAttribute(name: string, location?: string, level?: string): Promise<KeuzeModuleDto[]> {
        if (!name) {
            throw new BadRequestException("Ongeldig attribuut");
        }
        try{
            let escapedName = escapeRegExp(name);
            let escapedLocation = location ? escapeRegExp(location) : undefined;
            let escapedLevel = level ? escapeRegExp(level) : undefined;
            escapedName = normalizeString(escapedName);
            
            const keuzeModules = await this.keuzeModuleRepository.getByAttribute(escapedName, escapedLocation, escapedLevel);
            if (!keuzeModules) {
                throw new NotFoundException("Geen keuze modules gevonden met het opgegeven attribuut");
            }
            const keuzeModulesDto = KeuzeModuleMapper.toDTOArray(keuzeModules);
            return keuzeModulesDto;
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof BadRequestException) {
                this.logger.warn('Fout bij het ophalen van keuze modules op basis van attribuut.', {error, name, location, level});
                throw error;
            }
            this.logger.error('Fout bij het ophalen van keuze modules op basis van attribuut.', {error, name, location, level});
    }       throw new InternalServerErrorException("Er is een fout opgetreden??");
        }
}