import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { CommonModule } from '@angular/common';

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
  
    constructor(private loginService: LoginService, private router:Router) {}
  
    ngOnInit(): void {
      this.isLoggedIn = this.loginService.verificar();
    }
  
  
    handleLogin() {
      if (this.isLoggedIn) {
        this.logout();
      } else {
        this.router.navigate(['/login']); // Redirige al login si no está logueado
      }
    }
    
    logout() {
      sessionStorage.clear();
      this.isLoggedIn = false;
      this.router.navigate(['/home']); // Redirige correctamente después del logout
    }
}
