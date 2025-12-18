import { HttpService } from '@nestjs/axios/';
import { catchError, firstValueFrom, map } from 'rxjs';
import { Injectable } from '@nestjs/common';
import { KeuzemoduleAIEntity } from 'src/core/recommender-system/entity/keuzemodule.ai.entity';
import { level } from 'winston';

@Injectable()
export class FastApiClient {

    constructor(private readonly httpService: HttpService) {}

    async getRecommendations(params: any): Promise<KeuzemoduleAIEntity[]> {
        try {
            const heaaderRequest = {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
                // 'Authorization': `api-key` // hier moet ik nog de api-key toevoegen om gebruik te kunnen maken van de fastapi service endpoint.
            };
            const {data} = await firstValueFrom(
                this.httpService.post<KeuzemoduleAIEntity[]>('https://fab0ee7a-03fd-41c0-b58f-8e29c39424fa.mock.pstmn.io/api/recommender-system/recommendations', params, { headers: heaaderRequest }).pipe(
                    catchError((error) => {
                            console.error('Error ontstaan bij het ophalen van aanbevelingen:');
                        throw error;
                    })
                )
            );
            return data['recommendations'];
    }catch (error) {
            console.error('Error bij ophalen aanbevelingen:', error);
            throw error;

        }
    }
}