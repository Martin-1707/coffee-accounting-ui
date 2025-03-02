import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot} from '@angular/router';
import { LoginService } from '../services/login.service';

export const seguridadGuard = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const loginService = inject(LoginService);
  const router = inject(Router);
  const isAuthenticated = loginService.verificar();
  if (!isAuthenticated) {
    router.navigate(['/login']);
    return false;
  }
  return isAuthenticated;
};