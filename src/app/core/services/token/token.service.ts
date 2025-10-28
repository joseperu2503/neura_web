import { inject, Injectable, InjectionToken } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { SsrCookieService } from 'ngx-cookie-service-ssr';

export const TOKEN: string = 'token';

export const ACCESS_TOKEN = new InjectionToken<string>(TOKEN);

interface JwtPayload {
  id: number;
  email: string | null;
  isGuest: boolean;
  exp: number;
}

interface JwtInfo {
  value: string;
  payload: JwtPayload;
  expireIn: number;
}

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  cookieService = inject(SsrCookieService);
  tokenServer = inject(ACCESS_TOKEN, {
    optional: true,
  });

  saveToken(token: string): void {
    this.cookieService.set(TOKEN, token, { expires: 365, path: '/' });
  }

  removeToken(): void {
    this.cookieService.delete(TOKEN);
  }

  getToken(): JwtInfo | null {
    const token = this.tokenServer ?? this.cookieService.get(TOKEN);
    if (!token) {
      return null;
    }

    const payload: JwtPayload = jwtDecode<JwtPayload>(token);

    const tokenDate = new Date(0);
    tokenDate.setUTCSeconds(payload.exp);
    const today = new Date();

    const expireIn = tokenDate.getTime() - today.getTime();

    if (expireIn <= 0) {
      return null;
    }

    return {
      value: token,
      payload: payload,
      expireIn: expireIn,
    };
  }
}
