import { environment } from '../environments/environment';

export class ApiConfig {
  public static getApiUrl(): string {
    return environment.apiUrl;
  }

  public static getEnvironmentName(): string {
    return environment.environmentName;
  }

  public static isProduction(): boolean {
    return environment.production;
  }
}
