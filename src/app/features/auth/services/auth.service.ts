import { Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api/api.service';
import { TokenService } from '../../../core/services/token/token.service';
import { User } from '../interfaces/user.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private apiService: ApiService,
    private tokenService: TokenService
  ) {}

  login(email: string, password: string): Observable<User> {
    return this.apiService.post<User>(`/auth/login`, {
      email,
      password,
    });
  }

  saveToken(token: string): void {
    this.tokenService.saveToken(token);
  }

  removeToken(): void {
    this.tokenService.removeToken();
  }
}
