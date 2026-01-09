import {isNotEmpty, IsNotEmpty} from "class-validator";
import { sanitizeInput } from "src/utils/utils";

export class KeuzeModuleDto {
    @IsNotEmpty()
    id: number;
    @IsNotEmpty()
    name: string;
    @IsNotEmpty()
    description: string;
    @IsNotEmpty()
    shortdescription: string;
    @IsNotEmpty()
    content: string;
    @IsNotEmpty()
    location: string;
    @IsNotEmpty()
    studycredit: number;
    @IsNotEmpty()
    level: string;
    @IsNotEmpty()
    learningoutcomes: string;

}