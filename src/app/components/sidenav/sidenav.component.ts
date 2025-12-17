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
import { TopbarComponent } from "../topbar/topbar.component";

type MenuSection = { kind: 'section'; section: string };
type MenuItem = { kind: 'item'; icon: string; label: string; route: string; roles: string[] };
type MenuNode = MenuSection | MenuItem;

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
    RouterModule,
    TopbarComponent
  ],
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css'],
})
export class SidenavComponent implements OnInit {

  rol: string = '';
  username: string = '';

  collapsed = false;
  isLargeScreen = window.innerWidth > 768;
  mode: 'over' | 'side' = this.isLargeScreen ? 'side' : 'over';

  @HostBinding('class.content-shifted') get contentShifted() {
    return !this.collapsed && this.isLargeScreen;
  }

  // --- Menú completo con secciones ---
  private allMenu: MenuNode[] = [
    // PRINCIPAL
    { kind: 'section', section: 'PRINCIPAL' },
    {
      kind: 'item', icon: 'home', label: 'Inicio', route: '/dashboard',
      roles: ['Administrador', 'Supervisor', 'Vendedor', 'Cliente']
    },

    // OPERACIONES
    { kind: 'section', section: 'OPERACIONES' },
    {
      kind: 'item', icon: 'shopping_cart', label: 'Compras', route: '/compra-insumo',
      roles: ['Administrador', 'Supervisor', 'Vendedor']
    },
    {
      kind: 'item', icon: 'trending_up', label: 'Ventas', route: '/venta',
      roles: ['Administrador', 'Supervisor', 'Vendedor', 'Cliente']
    },
    {
      kind: 'item', icon: 'inventory_2', label: 'Productos', route: '/producto',
      roles: ['Administrador', 'Supervisor', 'Cliente']
    },
    {
      kind: 'item', icon: 'credit_card', label: 'Abonos', route: '/abonos',
      roles: ['Administrador', 'Supervisor', 'Vendedor', 'Cliente']
    },
    {
      kind: 'item', icon: 'credit_card', label: 'Clientes', route: '/clientes',
      roles: ['Administrador', 'Supervisor', 'Vendedor']
    },

    // FINANZAS
    { kind: 'section', section: 'FINANZAS' },
    {
      kind: 'item', icon: 'account_balance_wallet', label: 'Ventas - Producto', route: '/ventas-producto',
      roles: ['Administrador', 'Cliente']
    },
    {
      kind: 'item', icon: 'assignment', label: 'Historial de Ventas', route: '/historial-estado-venta',
      roles: ['Administrador', 'Supervisor', 'Cliente']
    },

    // ADMINISTRACIÓN
    { kind: 'section', section: 'ADMINISTRACIÓN' },
    { kind: 'item', icon: 'admin_panel_settings', label: 'Roles', route: '/rol', roles: ['Administrador'] },
    { kind: 'item', icon: 'credit_card', label: 'Tipos de Pago', route: '/tipo-pago', roles: ['Administrador'] },
    {
      kind: 'item', icon: 'description', label: 'Estado de Venta', route: '/estado-venta',
      roles: ['Administrador', 'Supervisor']
    },
    {
      kind: 'item', icon: 'people', label: 'Usuarios', route: '/usuario',
      roles: ['Administrador', 'Supervisor', 'Cliente']
    },
    {
      kind: 'item', icon: 'history', label: 'Historial de Precios', route: '/historial-precio-producto',
      roles: ['Administrador', 'Supervisor']
    },
  ];


  // Menú que se pinta según rol
  menuItems: MenuNode[] = [];

  constructor(
    private loginService: LoginService,
    private router: Router,
    private breakpointObserver: BreakpointObserver
  ) { }

  ngOnInit() {
    this.rol = this.loginService.showRole() || '';
    this.username = this.loginService.showUser() || '';

    // Filtra manteniendo encabezados que tengan al menos un item visible debajo
    const out: MenuNode[] = [];
    for (let i = 0; i < this.allMenu.length; i++) {
      const node = this.allMenu[i];

      if (node.kind === 'section') {
        // ¿hay algún item visible bajo esta sección?
        let keepSection = false;
        for (let j = i + 1; j < this.allMenu.length; j++) {
          const next = this.allMenu[j];
          if (next.kind === 'section') break;
          if (next.roles.includes(this.rol)) { keepSection = true; break; }
        }
        if (keepSection) out.push(node);
      } else {
        if (node.roles.includes(this.rol)) out.push(node);
      }
    }
    this.menuItems = out;


    // Responsivo
    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
      this.isLargeScreen = !result.matches;
      this.mode = this.isLargeScreen ? 'side' : 'over';

      if (!this.isLargeScreen) {
        this.collapsed = true; // móvil: cerrado
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

  goHome() { this.router.navigate(['/home']); }

  logout() {
    this.loginService.logout();
    this.router.navigate(['/home']);
    console.log("Cerrando sesión...");
  }  
}
