import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { KeuzeModule } from "src/core/keuzemodule/entities/keuzemodule.entitie";
import { AbstractKeuzeModuleRepository } from "src/core/keuzemodule/contract/abstract.keuzemodule.repository";
import { AbstractLogger } from "src/core/logger/abstract.logger";
import { escapeRegExp, normalizeString } from "src/utils/utils";

@Injectable()
export class KeuzeModuleService {
    constructor(private readonly keuzeModuleRepository: AbstractKeuzeModuleRepository, private readonly logger: AbstractLogger) {}

    async getAll(): Promise<KeuzeModule[]> {
        try{
           const keuzeModules = await this.keuzeModuleRepository.getAll();
           if(!keuzeModules){
            throw new NotFoundException("Geen Keuze modules gevonden");
           }
           return keuzeModules;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException("Er is een fout opgetreden");
        }
    }
    async getOne(id: string): Promise<KeuzeModule | null> {
        if (!id) {
            throw new BadRequestException("Ongeldig ID");
        }
        try{
            const keuzeModule = await this.keuzeModuleRepository.getOne(id);
            if (!keuzeModule) {
                throw new NotFoundException("Keuze module niet gevonden");
            }
            this.logger.log(`Keuze module opgehaald: ${keuzeModule.id}`, {id: keuzeModule.id, name: keuzeModule.name, code: keuzeModule.description, credits: keuzeModule.studycredit, location: keuzeModule.location, shortdescription: keuzeModule.shortdescription});
            return keuzeModule;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException("Er is een fout opgetreden??");
        }
    }
    async getByAttribute(name: string, location?: string, level?: string): Promise<KeuzeModule[]> {
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
            return keuzeModules;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
    }       throw new InternalServerErrorException("Er is een fout opgetreden??");
        }
}