import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  isLoggedIn: boolean = false;
  currentUrl = '/';

  // mostrar “Ir al sistema” cuando está logueado y está en páginas públicas
  get showGoToSystem(): boolean {
    const clean = this.currentUrl.split('?')[0];
    return this.isLoggedIn && (clean === '/' || clean === '/home' || clean === '/nosotros');
  }

  constructor(private loginService: LoginService, private router: Router) { }

  ngOnInit(): void {
    this.isLoggedIn = this.loginService.verificar();
    this.currentUrl = this.router.url;

    // actualiza estado al navegar (por si inicia/cierra sesión y vuelve)
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(e => {
        this.currentUrl = e.urlAfterRedirects;
        this.isLoggedIn = this.loginService.verificar();
      });
  }

  handleLogin() {
    if (this.isLoggedIn) {
      this.logout();
    } else {
      this.router.navigate(['/login']); // Redirige al login si no está logueado
    }
  }

  goToApp() {
    this.router.navigate(['/dashboard']);
  }

  logout() {
    sessionStorage.clear();
    this.isLoggedIn = false;
    this.router.navigate(['/home']); // Redirige correctamente después del logout
  }
}
