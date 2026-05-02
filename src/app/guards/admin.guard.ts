import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  await auth.roleLoaded();
  const role = auth.user()?.role;
  if (role === 'admin' || role === 'superadmin') return true;
  return router.createUrlTree(['/']);
};

export const superadminGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  await auth.roleLoaded();
  const role = auth.user()?.role;
  if (role === 'superadmin') return true;
  return router.createUrlTree(['/']);
};
