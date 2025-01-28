import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../../services/token/token.service';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const request = addToken(req);
  return next(request);
};

const addToken = (request: HttpRequest<unknown>) => {
  const tokenService = inject(TokenService);

  const token = tokenService.getToken();

  const authRequest = request.clone({
    headers: request.headers.set('Authorization', `Bearer ${token}`),
  });
  return authRequest;
};
