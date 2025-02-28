import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SidenavComponent } from "./components/sidenav/sidenav.component";
import { LoginService } from './services/login.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    MatSidenavModule,
    RouterOutlet,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    CommonModule,
    SidenavComponent
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'coffee-accounting-ui';


  constructor(private loginService: LoginService) {}

  // 🔍 Computed property para verificar si el usuario está logueado
  isLoggedIn = computed(() => this.loginService.verificar());
}
