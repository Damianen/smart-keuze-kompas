import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { KeuzeModule } from "src/core/keuzemodule/entities/keuzemodule.entitie";
import { AbstractKeuzeModuleRepository } from "src/core/keuzemodule/contract/abstract.keuzemodule.repository";

@Injectable()
export class KeuzeModuleService {
    constructor(private readonly keuzeModuleRepository: AbstractKeuzeModuleRepository) {}

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
            return keuzeModule;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException("Er is een fout opgetreden");
        }
    }
}