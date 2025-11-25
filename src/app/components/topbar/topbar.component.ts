import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterLink } from '@angular/router';
import { ThemeService } from '../../services/theme.service';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatMenuModule,
    MatDividerModule,
    MatTooltipModule
  ],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.css'
})
export class TopbarComponent {
  searchQuery = '';

  userName = '';
  userRole = '';
  userEmail = '';

  private themeService = inject(ThemeService);
  isDark = this.themeService.isDark;
  iconTheme = computed(() => this.isDark() ? 'light_mode' : 'dark_mode');
  tooltipTheme = computed(() => this.isDark() ? 'Modo claro' : 'Modo oscuro');


  constructor(private loginService: LoginService, private router: Router) {
    this.userName = this.loginService.showUser() || '';
    this.userRole = this.loginService.showRole() || '';
  }

  initials() {
    return (this.userName || 'U')
      .split(' ')
      .filter(n => n.trim().length > 0)
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  toggleTheme() {
    this.themeService.toggle();
  }

  goProfile() { }

  goSettings() { }

  logout() {
    this.loginService.logout();
    this.router.navigate(['/home']);
    console.log("Cerrando sesión...");
  }
}