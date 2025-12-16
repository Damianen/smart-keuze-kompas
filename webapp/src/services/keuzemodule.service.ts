import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { KeuzeModule } from '../dtos/module.dto';
import { handleError } from './error.service';

@Injectable({ providedIn: 'root' })
export class KeuzemoduleService {
  private apiUrl = 'http://localhost:3000/api/keuzemodules';
  constructor(private http: HttpClient) {}

  getAllKeuzeModules(): Observable<KeuzeModule[]> {
    return this.http
      .get<KeuzeModule[]>(this.apiUrl, { withCredentials: true })
      .pipe(
        map((response) => response),
        catchError((err) => handleError(err)),
      );
  }

  getKeuzeModuleById(id: number): Observable<KeuzeModule | null> {
    return this.http
      .get<KeuzeModule | null>(`${this.apiUrl}/${id}`, { withCredentials: true })
      .pipe(
        map((response) => response),
        catchError((err) => handleError(err)),
      );
  }
}
