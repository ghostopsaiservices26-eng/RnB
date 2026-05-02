import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { supabase } from '../supabase.client';

export const authGuard: CanActivateFn = async (route) => {
  const router = inject(Router);
  const { data: { session } } = await supabase.auth.getSession();

  if (session) return true;

  const returnUrl = route.url.map(s => s.path).join('/');
  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: '/' + returnUrl },
  });
};
