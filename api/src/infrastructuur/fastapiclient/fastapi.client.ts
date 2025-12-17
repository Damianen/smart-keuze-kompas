import axios from 'axios';
import { KeuzemoduleAIEntity } from 'src/core/recommender-system/entity/keuzemodule.ai.entity';


export class FastApiClient {

    async getRecommendations(studentInput: any): Promise<KeuzemoduleAIEntity[]> {
        try {
            const response = await axios.get('http://fastapi-service/recommendations', studentInput);
            return response.data; 
    }catch (error) {
            console.error('Error fetching recommendations from FastAPI:', error);
            throw error;
        }
    }
}