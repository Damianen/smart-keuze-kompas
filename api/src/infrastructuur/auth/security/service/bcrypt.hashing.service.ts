import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AbstractHashingService } from 'src/core/auth/security/contract/abstract.hashing.service';

@Injectable()
export class BcryptHashingService extends AbstractHashingService {
   async hash(data: string): Promise<string> {
       const salt = await bcrypt.genSalt(10);
       return await bcrypt.hash(data, salt);
   }

   async compare(data: string, hashedData: string): Promise<boolean> {
       return await bcrypt.compare(data, hashedData);
   }
}