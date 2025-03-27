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
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'abono',
        component: AbonoComponent,
        canActivate: [seguridadGuard],
        children: [
          {
            path: 'nuevo',
            component: CrearabonoComponent,
            canActivate: [seguridadGuard],
          },
        ],
      },
      {
        path: 'compra-insumo',
        component: CompraInsumoComponent,
        canActivate: [seguridadGuard],
        children: [
          {
            path: 'nuevo',
            component: CreareditarcomprainsumoComponent,
            canActivate: [seguridadGuard],
          },
        ],
      },
      {
        path: 'estado-venta',
        component: EstadoVentaComponent,
        canActivate: [seguridadGuard],
        children: [
          {
            path: 'nuevo',
            component: CreareditarestadoventaComponent,
            canActivate: [seguridadGuard],
          },
        ],
      },
      {
        path: 'historial-estado-venta',
        component: HistorialEstadoVentaComponent,
        canActivate: [seguridadGuard],
      },
      {
        path: 'producto',
        component: ProductoComponent,
        canActivate: [seguridadGuard],
        children: [
          {
            path: 'nuevo',
            component: CreareditarproductoComponent,
            canActivate: [seguridadGuard],
          },
        ],
      },
      {
        path: 'rol',
        component: RolComponent,
        canActivate: [seguridadGuard],
        children: [
          {
            path: 'nuevo',
            component: CreareditarrolComponent,
            canActivate: [seguridadGuard],
          },
        ],
      },
      {
        path: 'tipo-pago',
        component: TipoPagoComponent,
        canActivate: [seguridadGuard],
        children: [
          {
            path: 'nuevo',
            component: CreareditartipopagoComponent,
            canActivate: [seguridadGuard],
          },
        ],
      },
      {
        path: 'usuario',
        component: UsuarioComponent,
        canActivate: [seguridadGuard],

      },
      {
        path: 'venta',
        component: VentaComponent,
        canActivate: [seguridadGuard],
        children: [
          {
            path: 'nuevo',
            component: CreareditarventaComponent,
            canActivate: [seguridadGuard],
          },
        ],
      },
      {
        path: 'ventas-producto',
        component: VentasProductoComponent,
        canActivate: [seguridadGuard],
      },
    ]
  },


  //{ path: '**',
  //component: NotFoundComponent
  //}
];
