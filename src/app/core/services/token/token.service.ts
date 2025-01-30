import { inject, Injectable, InjectionToken } from '@angular/core';
import { JwtPayload, jwtDecode } from 'jwt-decode';
import { SsrCookieService } from 'ngx-cookie-service-ssr';

export const TOKEN: string = 'token';

export const ACCESS_TOKEN = new InjectionToken<string>(TOKEN);

interface JwtResponse extends JwtPayload {
  name: string;
  id: number;
  email: string;
}

interface ValidToken {
  isValid: true;
  decodedToken: JwtResponse;
  expireIn: number;
}

interface InvalidToken {
  isValid: false;
  decodedToken: null;
  expireIn: null;
}

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  cookieService = inject(SsrCookieService);
  tokenServer = inject(ACCESS_TOKEN, {
    optional: true,
  });

  saveToken(token: string) {
    this.cookieService.set(TOKEN, token, { expires: 365, path: '/' });
  }

  getToken() {
    const token = this.tokenServer ?? this.cookieService.get(TOKEN);
    console.log({ token });
    return token;
  }

  removeToken() {
    this.cookieService.delete(TOKEN);
  }

  validateToken(): ValidToken | InvalidToken {
    const decodedToken = this.decodeToken();
    if (!decodedToken) {
      return {
        isValid: false,
        decodedToken: null,
        expireIn: null,
      };
    }

    if (decodedToken && decodedToken?.exp) {
      const tokenDate = new Date(0);
      tokenDate.setUTCSeconds(decodedToken.exp);
      const today = new Date();

      const expireIn = tokenDate.getTime() - today.getTime();

      if (expireIn > 0) {
        return {
          isValid: true,
          decodedToken: decodedToken,
          expireIn: expireIn,
        };
      }
    }

    return {
      isValid: false,
      decodedToken: null,
      expireIn: null,
    };
  }

  decodeToken() {
    const token = this.getToken();
    if (!token) {
      return null;
    }
    const decodedToken = jwtDecode<JwtResponse>(token);
    return decodedToken;
  }
}
