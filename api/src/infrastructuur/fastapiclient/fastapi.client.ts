import { HttpService } from '@nestjs/axios/';
import { catchError, firstValueFrom, map } from 'rxjs';
import { Injectable } from '@nestjs/common';
import { KeuzemoduleAIEntity } from 'src/core/recommender-system/entity/keuzemodule.ai.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FastApiClient {

    constructor(private readonly httpService: HttpService, private readonly configService: ConfigService) {}

    async getRecommendations(params: any): Promise<KeuzemoduleAIEntity[]> {
        try {
            const heaaderRequest = {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'x-api-key': `${this.configService.get('API_KEY')}`
            };
            const {data} = await firstValueFrom(
                this.httpService.post<KeuzemoduleAIEntity[]>(`${this.configService.get('FAST_API_URL')}`, params, { headers: heaaderRequest }).pipe(
                    catchError((error) => {
                            console.error('Error ontstaan bij het ophalen van aanbevelingen:');
                            throw error;
                    }),
                )
            );
            return data['recommendations'];
    }catch (error) {
            console.error('Error bij ophalen aanbevelingen:', error);
            return error;
        }
    }
}