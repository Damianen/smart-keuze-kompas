import { HttpService } from '@nestjs/axios/';
import { catchError, firstValueFrom, map } from 'rxjs';
import { BadGatewayException, Injectable } from '@nestjs/common';
import { KeuzemoduleAIEntity } from 'src/core/recommender-system/entity/keuzemodule.ai.entity';
import { ConfigService } from '@nestjs/config';


type KeuzemoduleAIResponse = {
    recommendations: KeuzemoduleAIEntity[];
};

@Injectable()
export class FastApiClient {

    constructor(private readonly httpService: HttpService, private readonly configService: ConfigService) {}


    async getRecommendations(params: any): Promise<KeuzemoduleAIEntity[]> {
        try {

            const url = this.configService.get('FAST_API_URL');
            const apiKey = this.configService.get('API_KEY');

            const headerRequest = {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'x-api-key': `${apiKey}`,
            };
            const {data} = await firstValueFrom(
                this.httpService.post<KeuzemoduleAIResponse>(`${url}`, params, { headers: headerRequest }).pipe(
                    catchError((error) => {
                            console.error('Error ontstaan bij het ophalen van aanbevelingen:', {
                                url: error.config?.url,
                                status: error.response?.status,
                                data: error.response?.data,
                            });
                        throw error;
                    }),
                )
            );
            return data.recommendations ?? [];
    }catch (error) {
            console.error('Error bij ophalen aanbevelingen:', error);
            throw new BadGatewayException('Fout bij communiceren met de aanbevelingsservice.');
        }
    }
}