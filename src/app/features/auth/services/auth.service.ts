import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { ApiService } from '../../../core/services/api/api.service';
import { TokenService } from '../../../core/services/token/token.service';
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiService = inject(ApiService);
  private tokenService = inject(TokenService);
  private router = inject(Router);

  login(email: string, password: string): Observable<User> {
    return this.apiService
      .post<User>(`/auth/login`, {
        email,
        password,
      })
      .pipe(
        tap((user) => {
          this.tokenService.saveToken(user.accessToken);
        })
      );
  }

  register(
    email: string,
    password: string,
    passwordConfirmation: string
  ): Observable<User> {
    return this.apiService
      .post<User>(`/auth/register`, {
        email,
        password,
        passwordConfirmation,
      })
      .pipe(
        tap((user) => {
          this.tokenService.saveToken(user.accessToken);
        })
      );
  }

  guestRegister(): Observable<User> {
    return this.apiService.get<User>(`/auth/guest/register`).pipe(
      tap((user) => {
        this.tokenService.saveToken(user.accessToken);
      })
    );
  }

  logout() {
    this.tokenService.removeToken();
    this.router.navigate(['/']);
  }
}
