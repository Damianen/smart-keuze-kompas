import {isNotEmpty, IsNotEmpty, IsDefined} from "class-validator";
import { sanitizeInput } from "src/utils/utils";

export class KeuzeModuleDto {
    @IsNotEmpty()
    id: number;
    @IsNotEmpty()
    @IsDefined()
    name: string;
    @IsNotEmpty()
    @IsDefined()
    description: string;
    @IsNotEmpty()
    @IsDefined()
    shortdescription: string;
    @IsNotEmpty()
    @IsDefined()
    content: string;
    @IsNotEmpty()
    @IsDefined()
    location: string;
    @IsNotEmpty()
    @IsDefined()
    studycredit: number;
    @IsNotEmpty()
    @IsDefined()
    level: string;
    @IsNotEmpty()
    @IsDefined()
    learningoutcomes: string;

}