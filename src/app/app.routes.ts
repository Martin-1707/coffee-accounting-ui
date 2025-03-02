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
  },
  {
    path: 'compra-insumo',
    component: CompraInsumo,
  },
  {
    path: 'estado-venta',
    component: EstadoVentaComponent,
  },
  {
    path: 'historial-estado-venta',
    component: HistorialEstadoVentaComponent,
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
  },
  {
    path: 'rol ',
    component: RolComponent,
  },
  {
    path: 'tipo-pago',
    component: TipoPagoComponent,
  },
  {
    path: 'usuario',
    component: UsuarioComponent,
  },
  {
    path: 'venta',
    component: VentaComponent,
  },
  {
    path: 'ventas-producto',
    component: VentasProductoComponent,
  },

  //{ path: '**',
  //component: NotFoundComponent
  //}
];
