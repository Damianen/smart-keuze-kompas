import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { asyncScheduler, catchError, map, Observable, scheduled, tap } from 'rxjs';
import { LoginDto, RegisterDto } from '../dtos/user.dto';
import { handleError } from './error.service';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = 'localhost:3000';
  private _isAuthenticated: boolean = false;
  constructor(private http: HttpClient) {}

  login(login: LoginDto): Observable<{ success: boolean; message: string }> {
    return this.http
      .post<{
        success: boolean;
        message: string;
      }>(this.apiUrl + '/login', login, { withCredentials: true })
      .pipe(
        tap((response) => {
          this.isAuthenticated(response.success);
        }),
        map((response) => response),
        catchError((err) => handleError(err)),
      );
  }
  register(register: RegisterDto): Observable<{ success: boolean; message: string }> {
    return this.http
      .post<{
        success: boolean;
        message: string;
      }>(this.apiUrl + '/register', register, { withCredentials: true })
      .pipe(
        map((response) => response),
        catchError((err) => handleError(err)),
      );
  }
  logout(): Observable<any> {
    return this.http
      .post<{
        success: boolean;
        message: string;
      }>(`${this.apiUrl}/logout`, {}, { withCredentials: true })
      .pipe(
        tap(() => {
          this.isAuthenticated(false);
        }),
        map((response) => response.success),
        catchError((err) => handleError(err)),
      );
  }
  checkAuth(): Observable<boolean> {
    return this.http
      .get<{ success: boolean }>(`${this.apiUrl}/user`, { withCredentials: true })
      .pipe(
        map((res) => {
          this.isAuthenticated(res.success);
          return this._isAuthenticated;
        }),
        catchError(() => scheduled([false], asyncScheduler)),
      );
  }
  private isAuthenticated(value: boolean) {
    this._isAuthenticated = value;
  }
  public isLoggedIn(): boolean {
    return this._isAuthenticated;
  }
}
