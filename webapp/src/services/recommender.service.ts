import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { KeuzeModuleAI, RecommendationInput, SaveRecommendation, SavedCollection, SavedRecommendationsResponse } from '../dtos/module.dto';
import { handleError } from './error.service';
import { ApiConfig } from '../utils/api-config';

interface Response {
  message: string;
  status: boolean;
}

@Injectable({ providedIn: 'root' })
export class RecommenderService {
  private apiUrl = `${ApiConfig.getApiUrl()}/api`;

  constructor(private http: HttpClient) {}

  getRecommendations(input: RecommendationInput): Observable<KeuzeModuleAI[]> {
    return this.http
      .post<KeuzeModuleAI[]>(`${this.apiUrl}/recommender-system/recommendations`, input, {
        withCredentials: true
      })
      .pipe(
        map((response) => response),
        catchError((err) => handleError(err)),
      );
  }

  saveRecommendations(recommendations: SaveRecommendation[]): Observable<Response> {
    return this.http
      .post<Response>(`${this.apiUrl}/save-recommendation/save`, recommendations, {
        withCredentials: true
      })
      .pipe(
        map((response) => response),
        catchError((err) => handleError(err)),
      );
  }

  getSavedRecommendations(): Observable<SavedCollection[]> {
    return this.http
      .get<SavedRecommendationsResponse>(`${this.apiUrl}/get-recommendations/get`, {
        withCredentials: true
      })
      .pipe(
        map((response) => response.recommendations),
        catchError((err) => handleError(err)),
      );
  }

  deleteModule(collectionId: string, moduleId: number): Observable<Response> {
    return this.http
      .delete<Response>(`${this.apiUrl}/delete-recommendations/delete/${collectionId}/${moduleId}`, {
        withCredentials: true
      })
      .pipe(
        map((response) => response),
        catchError((err) => handleError(err)),
      );
  }

  deleteCollection(collectionId: string): Observable<Response> {
    return this.http
      .delete<Response>(`${this.apiUrl}/delete-recommendations/delete-collection/${collectionId}`, {
        withCredentials: true
      })
      .pipe(
        map((response) => response),
        catchError((err) => handleError(err)),
      );
  }
}
