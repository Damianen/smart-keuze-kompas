import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { KeuzeModule } from '../dtos/module.dto';
import { handleError } from './error.service';
import { ApiConfig } from '../utils/api-config';

@Injectable({ providedIn: 'root' })
export class KeuzemoduleService {
  private apiUrl = `${ApiConfig.getApiUrl()}/api/keuzemodules`;
  constructor(private http: HttpClient) {}

  getAllKeuzeModules(): Observable<KeuzeModule[]> {
    return this.http
      .get<KeuzeModule[]>(`${this.apiUrl}/getAll`, { withCredentials: true })
      .pipe(
        map((response) => response),
        catchError((err) => handleError(err)),
      );
  }

  getKeuzeModuleById(id: number): Observable<KeuzeModule | null> {
    return this.http
      .get<KeuzeModule | null>(`${this.apiUrl}/getOne/${id}`, { withCredentials: true })
      .pipe(
        map((response) => response),
        catchError((err) => handleError(err)),
      );
  }

  searchKeuzeModules(name: string, location?: string, level?: string): Observable<KeuzeModule[]> {
    let params: any = { name };
    if (location) params.location = location;
    if (level) params.level = level;

    return this.http
      .get<KeuzeModule[]>(`${this.apiUrl}/search`, {
        params,
        withCredentials: true
      })
      .pipe(
        map((response) => response),
        catchError((err) => handleError(err)),
      );
  }
}
