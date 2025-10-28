import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../../services/token/token.service';

export const authGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  if (tokenService.getToken() && !tokenService.getToken()?.payload.isGuest) {
    return true;
  }

  router.navigate(['/']);
  return false;
};
