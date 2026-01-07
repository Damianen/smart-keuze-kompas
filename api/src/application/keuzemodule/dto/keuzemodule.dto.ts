import {isNotEmpty, IsNotEmpty} from "class-validator";
import { ObjectId } from "mongodb";

    
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