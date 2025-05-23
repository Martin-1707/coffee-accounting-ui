import { Component, ViewChild, OnInit, Output, EventEmitter, Input, computed, HostBinding } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../services/login.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatSidenavModule } from '@angular/material/sidenav';

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
    RouterModule
  ],
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css'],
})
export class SidenavComponent implements OnInit {

  rol: string = '';
  username: string = '';

  collapsed = false;
  isLargeScreen = window.innerWidth > 768; // Detecta si la pantalla es grande
  mode: 'over' | 'side' = this.isLargeScreen ? 'side' : 'over';

  // 📌 Esta propiedad permitirá cambiar la clase en `<mat-sidenav-content>`
  @HostBinding('class.content-shifted') get contentShifted() {
    return !this.collapsed && this.isLargeScreen;
  }

  menuItems: any[] = [
    { icon: 'dashboard', label: 'Inicio', route: '/dashboard', roles: ['Administrador', 'Supervisor', 'Vendedor', 'Cliente'] },
    { icon: 'payments', label: 'Abono', route: '/abonos', roles: ['Administrador', 'Supervisor', 'Vendedor', 'Cliente'] },
    { icon: 'shopping_cart', label: 'Compras', route: '/compra-insumo', roles: ['Administrador', 'Supervisor', 'Vendedor'] },
    { icon: 'assignment', label: 'Estado de Venta', route: '/estado-venta', roles: ['Administrador'] },
    { icon: 'history', label: 'Historial', route: '/historial-estado-venta', roles: ['Administrador', 'Cliente', 'Vendedor'] },
    { icon: 'store', label: 'Producto', route: '/producto', roles: ['Administrador', 'Supervisor', 'Cliente', 'Vendedor'] },
    { icon: 'admin_panel_settings', label: 'Rol', route: '/rol', roles: ['Administrador'] },
    { icon: 'credit_card', label: 'Tipo de Pago', route: '/tipo-pago', roles: ['Administrador'] },
    { icon: 'people', label: 'Usuario', route: '/usuario', roles: ['Administrador', 'Supervisor', 'Vendedor', 'Cliente'] },
    { icon: 'sell', label: 'Venta', route: '/venta', roles: ['Administrador', 'Supervisor', 'Vendedor', 'Cliente'] },
    { icon: 'receipt_long', label: 'Ventas-Producto', route: '/ventas-producto', roles: ['Administrador', 'Vendedor', 'Cliente'] },
    { icon: 'history', label: 'Historial-Precio-Producto', route: '/historial-precio-producto', roles: ['Administrador', 'Vendedor'] }
  ];

  constructor(
    private loginService: LoginService,
    private router: Router,
    private breakpointObserver: BreakpointObserver
  ) { }

  ngOnInit() {

    this.rol = this.loginService.showRole() || '';
    this.username = this.loginService.showUser() || '';

    this.menuItems = this.menuItems.filter(item => item.roles.includes(this.rol));

    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
      this.isLargeScreen = !result.matches;
      this.mode = this.isLargeScreen ? 'side' : 'over';

      if (!this.isLargeScreen) {
        this.collapsed = true; // En móviles, siempre cerrado
      } else {
        const savedState = localStorage.getItem('sidenavCollapsed');
        this.collapsed = savedState ? JSON.parse(savedState) : false;
      }
    });
  }


  // Alternar colapsado sin afectar si el sidenav está abierto
  toggleCollapse(): void {
    this.collapsed = !this.collapsed;

    if (this.isLargeScreen) {
      localStorage.setItem('sidenavCollapsed', JSON.stringify(this.collapsed));
    }
  }

  closeSidenav() {
    if (!this.isLargeScreen) {
      this.collapsed = true;
    }
  }

  logout() {
    this.loginService.logout();
    this.router.navigate(['/home']);
    console.log("Cerrando sesión...");
  }
}
