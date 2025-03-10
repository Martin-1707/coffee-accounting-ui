import { Component, ViewChild, OnInit, Output, EventEmitter, Input, computed } from '@angular/core';
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
  styleUrls: ['./sidenav.component.css'],
})
export class SidenavComponent implements OnInit {

  username: string = '';
  rol: string = '';
//nuevo
  collapsed= false;

  toggleCollapse():void{
    this.collapsed = !this.collapsed;
  }

  closeSidenav():void {
    this.collapsed =false
  }

  menuItems: any[] = [
    { icon: 'dashboard', label: 'Inicio', route: '/dashboard' },
    { icon: 'payments', label: 'Abono', route: '/abono' },
    { icon: 'shopping_cart', label: 'Compra de Insumos', route: '/compra-insumo' },
    { icon: 'assignment', label: 'Estado de Venta', route: '/estado-venta' },
    { icon: 'history', label: 'Historial Estado de Venta', route: '/historial-estado-venta' },
    { icon: 'store', label: 'Producto', route: '/producto' },
    { icon: 'admin_panel_settings', label: 'Rol', route: '/rol' },
    { icon: 'credit_card', label: 'Tipo de Pago', route: '/tipo-pago' },
    { icon: 'people', label: 'Usuario', route: '/usuario' },
    { icon: 'sell', label: 'Venta', route: '/venta' },
    { icon: 'receipt_long', label: 'Ventas-Producto', route: '/ventas-producto' }
  ];

  constructor(
    private loginService: LoginService,
    private router: Router,
  ) {}

  isLoggedIn = computed(() => this.loginService.verificar());

  ngOnInit() {
    this.username = this.loginService.showUser();
    this.rol = this.loginService.showRole();
  }

  logout() {
    this.loginService.logout();
    this.router.navigate(['/home']);
  }
}
