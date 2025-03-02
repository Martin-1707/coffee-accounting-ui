import { Component, ViewChild, OnInit, Output, EventEmitter } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../services/login.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
  ],
  templateUrl: './sidenav.component.html',
  styleUrl:  './sidenav.component.css',
})
export class SidenavComponent implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  @Output() changeIsLeftSidebarCollapsed = new EventEmitter<boolean>();
  username: string = '';
  rol: string = '';
  


  menuItems: any[] = [
    { icon: 'dashboard', label: 'Inicio', route: '/dashboard' },
    { icon: 'payments', label: 'Abono', route: '/abono'}
  ];

  constructor(
    private loginService: LoginService,
    private router: Router,
    private breakpointObserver: BreakpointObserver
  ) {}

  isLoggedIn = this.loginService.verificar();

  ngOnInit() {
    this.username = this.loginService.showUser();
    this.rol = this.loginService.showRole();
  }

  toggleCollapse(): void {
    this.sidenav.toggle();
    this.changeIsLeftSidebarCollapsed.emit(this.sidenav.opened);
  }

  closeSidenav(): void {
    this.sidenav.close();
    this.changeIsLeftSidebarCollapsed.emit(false);
  }

  logout() {
    this.loginService.logout();
    this.router.navigate(['/home']);
  }
}
