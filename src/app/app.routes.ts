import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { NosotrosComponent } from './components/home/nosotros/nosotros.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AbonoComponent } from './components/abono/abono.component';
import { CompraInsumo } from './models/compra-insumo';
import { VentaComponent } from './components/venta/venta.component';
import { ProductoComponent } from './components/producto/producto.component';
import { RolComponent } from './components/rol/rol.component';
import { TipoPagoComponent } from './components/tipo-pago/tipo-pago.component';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { EstadoVentaComponent } from './components/estado-venta/estado-venta.component';
import { HistorialEstadoVentaComponent } from './components/historial-estado-venta/historial-estado-venta.component';
import { VentasProductoComponent } from './components/ventas-producto/ventas-producto.component';
import { CrearabonoComponent } from './components/abono/crearabono/crearabono.component';
import { ListarproductoComponent } from './components/producto/listarproducto/listarproducto.component';
import { seguridadGuard } from './guard/seguridad.guard';
import { CompraInsumoComponent } from './components/compra-insumo/compra-insumo.component';
import { ListarrolComponent } from './components/rol/listarrol/listarrol.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';

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
        children: [
          {
            path: 'nuevo',
            component:  CrearabonoComponent,
          },
        ],
        canActivate: [seguridadGuard],
      },
      {
        path: 'compra-insumo',
        component: CompraInsumoComponent,
        canActivate: [seguridadGuard],
      },
      {
        path: 'estado-venta',
        component: EstadoVentaComponent,
        canActivate: [seguridadGuard],
      },
      {
        path: 'historial-estado-venta',
        component: HistorialEstadoVentaComponent,
        canActivate: [seguridadGuard],
      },
      {
        path: 'producto',
        component: ProductoComponent,
        children: [
          {
            path: 'nuevo',
            component:  ListarproductoComponent,
          },
        ],
        canActivate: [seguridadGuard],
      },
      {
        path: 'rol',
        component: RolComponent,
        canActivate: [seguridadGuard],
    
      },
      {
        path: 'tipo-pago',
        component: TipoPagoComponent,
        canActivate: [seguridadGuard],
    
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
