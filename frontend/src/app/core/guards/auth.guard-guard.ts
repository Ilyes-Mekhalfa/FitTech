import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from '../services/token.service';

export const authGuardGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const tokenService = inject(TokenService)

  const token = tokenService.getToken();

  if (token) {
    return true;
  }

  return router.createUrlTree(['/login']);
};
