import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../../services/token/token.service';

export const AuthGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  if (tokenService.validateToken().isValid) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
