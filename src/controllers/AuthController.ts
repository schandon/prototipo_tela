import { LoginCredentials, AuthResponse } from '../models/User';
import { api } from '../services/api_auth';

class AuthController {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/sessions', credentials);
    this.setToken(response.data.token);
    if (response.status === 200) {
      window.location.href = '/dashboard';
    }
    return response.data;
  }

  private setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const authController = new AuthController();
