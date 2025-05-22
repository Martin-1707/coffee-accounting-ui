import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { NosotrosComponent } from './components/home/nosotros/nosotros.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AbonoComponent } from './components/abono/abono.component';
import { VentaComponent } from './components/venta/venta.component';
import { ProductoComponent } from './components/producto/producto.component';
import { RolComponent } from './components/rol/rol.component';
import { TipoPagoComponent } from './components/tipo-pago/tipo-pago.component';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { EstadoVentaComponent } from './components/estado-venta/estado-venta.component';
import { HistorialEstadoVentaComponent } from './components/historial-estado-venta/historial-estado-venta.component';
import { VentasProductoComponent } from './components/ventas-producto/ventas-producto.component';
import { CrearabonoComponent } from './components/abono/crearabono/crearabono.component';
import { seguridadGuard } from './guard/seguridad.guard';
import { CompraInsumoComponent } from './components/compra-insumo/compra-insumo.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { CreareditarproductoComponent } from './components/producto/creareditarproducto/creareditarproducto.component';
import { CreareditarcomprainsumoComponent } from './components/compra-insumo/creareditarcomprainsumo/creareditarcomprainsumo.component';
import { CreareditarestadoventaComponent } from './components/estado-venta/creareditarestadoventa/creareditarestadoventa.component';
import { CreareditarrolComponent } from './components/rol/creareditarrol/creareditarrol.component';
import { CreareditartipopagoComponent } from './components/tipo-pago/creareditartipopago/creareditartipopago.component';
import { CreareditarventaComponent } from './components/venta/creareditarventa/creareditarventa.component';
import { HistorialPrecioProductoComponent } from './components/historial-precio-producto/historial-precio-producto.component';
import { ListarabonoComponent } from './components/abono/listarabono/listarabono.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'nosotros',
    component: NosotrosComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    component: SidenavComponent,
    canActivate: [seguridadGuard],
    data: { roles: ['Administrador', 'Supervisor', 'Vendedor', 'Cliente'] },
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [seguridadGuard],
        data: { roles: ['Administrador', 'Supervisor', 'Vendedor', 'Cliente'] },
      },
      {
        path: 'abonos',
        component: AbonoComponent,
        canActivate: [seguridadGuard],
        data: { roles: ['Administrador', 'Supervisor', 'Vendedor', 'Cliente'] },
        children: [
          {
            path: 'nuevo',
            component: CrearabonoComponent,
            canActivate: [seguridadGuard],
            data: { roles: ['Administrador', 'Supervisor', 'Vendedor'] },
          },
          {
            path: 'venta/:idventa',
            component: ListarabonoComponent, // 👈 esta es la nueva ruta
            canActivate: [seguridadGuard],
            data: { roles: ['Administrador', 'Supervisor', 'Vendedor', 'Cliente'] },
          },
        ],
      },
      {
        path: 'compra-insumo',
        component: CompraInsumoComponent,
        canActivate: [seguridadGuard],
        data: { roles: ['Administrador', 'Supervisor', 'Vendedor'] },
        children: [
          {
            path: 'nuevo',
            component: CreareditarcomprainsumoComponent,
            canActivate: [seguridadGuard],
            data: { roles: ['Administrador', 'Supervisor', 'Vendedor'] },
          },
        ],
      },
      {
        path: 'estado-venta',
        component: EstadoVentaComponent,
        canActivate: [seguridadGuard],
        data: { roles: ['Administrador', 'Supervisor'] },
        children: [
          {
            path: 'nuevo',
            component: CreareditarestadoventaComponent,
            canActivate: [seguridadGuard],
            data: { roles: ['Administrador'] },
          },
        ],
      },
      {
        path: 'historial-estado-venta',
        component: HistorialEstadoVentaComponent,
        canActivate: [seguridadGuard],
        data: { roles: ['Administrador', 'Supervisor', 'Vendedor', 'Cliente'] },
      },
      {
        path: 'producto',
        component: ProductoComponent,
        canActivate: [seguridadGuard],
        data: { roles: ['Administrador', 'Supervisor', 'Vendedor', 'Cliente'] },
        children: [
          {
            path: 'nuevo',
            component: CreareditarproductoComponent,
            canActivate: [seguridadGuard],
            data: { roles: ['Administrador', 'Supervisor', 'Vendedor'] },
          },
          {
            path: 'editar/:id',
            component: CreareditarproductoComponent,
            canActivate: [seguridadGuard],
            data: { roles: ['Administrador', 'Supervisor', 'Vendedor'] }
          },
        ],
      },
      {
        path: 'rol',
        component: RolComponent,
        canActivate: [seguridadGuard],
        data: { roles: ['Administrador'] },
        children: [
          {
            path: 'nuevo',
            component: CreareditarrolComponent,
            canActivate: [seguridadGuard],
            data: { roles: ['Administrador'] },
          },
        ],
      },
      {
        path: 'tipo-pago',
        component: TipoPagoComponent,
        canActivate: [seguridadGuard],
        data: { roles: ['Administrador'] },
        children: [
          {
            path: 'nuevo',
            component: CreareditartipopagoComponent,
            canActivate: [seguridadGuard],
            data: { roles: ['Administrador'] },
          },
        ],
      },
      {
        path: 'usuario',
        component: UsuarioComponent,
        canActivate: [seguridadGuard],
        data: { roles: ['Administrador', 'Supervisor', 'Vendedor', 'Cliente'] },
      },
      {
        path: 'venta',
        component: VentaComponent,
        canActivate: [seguridadGuard],
        data: { roles: ['Administrador', 'Supervisor', 'Vendedor', 'Cliente'] },
        children: [
          {
            path: 'nuevo',
            component: CreareditarventaComponent,
            canActivate: [seguridadGuard],
            data: { roles: ['Administrador', 'Supervisor', 'Vendedor'] },
          },
        ],
      },
      {
        path: 'ventas-producto',
        component: VentasProductoComponent,
        canActivate: [seguridadGuard],
        data: { roles: ['Administrador', 'Supervisor', 'Vendedor', 'Cliente'] },
      },
      {
        path: 'historial-precio-producto',
        component: HistorialPrecioProductoComponent,
        canActivate: [seguridadGuard],
        data: { roles: ['Administrador', 'Supervisor', 'Vendedor'] },
      },
    ]
  },

  //{ path: '**',
  //component: NotFoundComponent
  //}
];
