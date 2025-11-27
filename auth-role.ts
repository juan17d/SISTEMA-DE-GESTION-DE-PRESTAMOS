// src/app/auth/auth-role.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const RoleGuard = (requiredRole: string): CanActivateFn => {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);
    const rol = auth.getRol();
    if (!rol || rol !== requiredRole) {
      router.navigate(['/login'], { replaceUrl: true });
      return false;
    }
    return true;
  };
};
