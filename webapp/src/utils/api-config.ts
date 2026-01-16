export class ApiConfig {
  private static readonly DEV_URL = 'http://localhost:3000';
  private static readonly PROD_URL = 'https://smart-keuze-kompas.onrender.com';

  private static readonly environment: 'dev' | 'prod' = 'prod';

  public static getApiUrl(): string {
    return this.environment === 'dev' ? this.PROD_URL : this.DEV_URL;
  }
}
