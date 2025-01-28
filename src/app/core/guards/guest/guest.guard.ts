import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../../services/token/token.service';

export const guestGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  if (tokenService.validateToken().isValid) {
    router.navigate(['/dashboard']);
    return false;
  } else {
    return true;
  }
};
