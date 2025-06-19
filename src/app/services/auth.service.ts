import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = '/api/login_check';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<{ token: string, roles: string[] }> {
    return this.http.post<{ token: string }>(this.apiUrl, { email, password }).pipe(
      map(response => {
        const token = response.token;
        this.saveToken(token);
        const roles = this.getRolesFromToken(token);
        this.saveRoles(roles);
        return { token, roles };
      })
    );
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  saveRoles(roles: string[]): void {
    if (roles && Array.isArray(roles)) {
      localStorage.setItem('roles', JSON.stringify(roles));
    }
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRoles(): string[] {
    const roles = localStorage.getItem('roles');
    if (!roles || roles === 'undefined') {
      return [];
    }

    try {
      return JSON.parse(roles);
    } catch (e) {
      console.error('Error al parsear roles del localStorage:', e);
      return [];
    }
  }

  isAdmin(): boolean {
    return this.getRoles().includes('ROLE_ADMIN');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('roles');
    localStorage.removeItem('userFavorites_');
  }

  private getRolesFromToken(token: string): string[] {
    const payload = this.parseJwt(token);
    return payload?.roles || [];
  }

  private parseJwt(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('Error al parsear el token JWT:', e);
      return null;
    }
  }

  getUserId(): string | null { // Cambia el tipo de retorno a string | null
    const token = this.getToken();
    if (token) {
      const payload = this.parseJwt(token);
      if (payload && payload.username) { // Usa 'username'
        return payload.username; // Devuelve el email del usuario
      }
    }
    return null;
  }

  register(name: string, email: string, password: string) {
    return this.http.post<any>('/api/register', { name, email, password });
  }

}