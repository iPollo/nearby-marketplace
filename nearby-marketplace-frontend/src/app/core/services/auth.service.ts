import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse, DecodedToken, LoginRequest, RegisterRequest } from '../models/auth.model';

const TOKEN_KEY = 'nearby_token';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly baseUrl = `${environment.apiUrl}/auth`;

  currentUserEmail = signal<string | null>(this.getEmailFromStoredToken());

  constructor(private http: HttpClient) {}

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, request).pipe(
      tap((response) => this.setSession(response.token))
    );
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/register`, request).pipe(
      tap((response) => this.setSession(response.token))
    );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    this.currentUserEmail.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    const decoded = this.decodeToken(token);
    if (!decoded) return false;

    const isExpired = decoded.exp * 1000 < Date.now();
    return !isExpired;
  }

  private setSession(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
    const decoded = this.decodeToken(token);
    this.currentUserEmail.set(decoded?.sub ?? null);
  }

  private getEmailFromStoredToken(): string | null {
    const token = this.getToken();
    if (!token) return null;
    return this.decodeToken(token)?.sub ?? null;
  }

  private decodeToken(token: string): DecodedToken | null {
    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decoded) as DecodedToken;
    } catch {
      return null;
    }
  }
}
