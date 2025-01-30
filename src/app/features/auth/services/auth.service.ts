import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api/api.service';
import { TokenService } from '../../../core/services/token/token.service';
import { User } from '../interfaces/user.interface';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiService = inject(ApiService);
  private tokenService = inject(TokenService);
  private router = inject(Router);

  login(email: string, password: string): Observable<User> {
    return this.apiService.post<User>(`/auth/login`, {
      email,
      password,
    });
  }

  logout() {
    this.tokenService.removeToken();
    this.router.navigate(['/']);
  }

  saveToken(token: string): void {
    this.tokenService.saveToken(token);
  }

  removeToken(): void {
    this.tokenService.removeToken();
  }
}
