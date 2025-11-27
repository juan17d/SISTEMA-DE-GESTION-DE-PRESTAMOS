import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const expectedRoles = route.data['roles'] as string[];

  // 1. Si no está logueado, no revisamos roles
  if (!auth.isLoggedIn()) {
    return router.createUrlTree(['/login']);
  }

  // 2. Verificamos si tiene al menos 1 rol requerido
  const hasRole = expectedRoles.some(role => auth.hasRole(role));

  return hasRole ? true : router.createUrlTree(['/not-authorized']);
};
