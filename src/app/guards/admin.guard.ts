import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs/operators';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.appUser$.pipe(
    map(user => {
      if (user?.rol === 'administrador') {
        return true;
      }

      router.navigate(['/']);
      return false;
    })
  );
};