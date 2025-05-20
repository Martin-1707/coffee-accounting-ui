import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { Venta } from '../../../models/venta';
import { VentaService } from '../../../services/venta.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { LoginService } from '../../../services/login.service';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { HistorialEstadoVenta } from '../../../models/historial-estado-venta';
import { VentasProducto } from '../../../models/ventas-producto';
import { HistorialEstadoVentaService } from '../../../services/historial-estado-venta.service';
import { VentasProductoService } from '../../../services/ventas-producto.service';
@Component({
  selector: 'app-listarventa',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    RouterModule,
    MatPaginator,
    MatCheckboxModule,
    MatCardModule,
    MatExpansionModule,
    MatListModule,
  ],
  templateUrl: './listarventa.component.html',
  styleUrl: './listarventa.component.css',
})
export class ListarventaComponent implements OnInit {
  dataSource: MatTableDataSource<Venta> = new MatTableDataSource();
  displayedColumns: string[] = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7'];

  usuarioAutenticado: string = '';
  rolUsuario: string = '';

  historialEstados: HistorialEstadoVenta[] = [];
  ventasProductos: VentasProducto[] = [];

  modoTarjeta: boolean = false;

  constructor(private vS: VentaService, private hevS: HistorialEstadoVentaService, private vpS: VentasProductoService, private router: Router, private loginService: LoginService) { }


  ngOnInit(): void {

    this.cargarProductosVenta();

    this.usuarioAutenticado = this.loginService.showUser() || '';
    this.rolUsuario = this.loginService.showRole() || '';

    this.vS.list().subscribe((data) => {
      if (this.rolUsuario === 'Cliente') {
        // Filtrar ventas donde el usuario autenticado sea el usuarioCliente
        this.dataSource = new MatTableDataSource(
          data.filter((venta) => venta.usuarioCliente.username === this.usuarioAutenticado)
        );
      } else if (this.rolUsuario === 'Vendedor') {
        // Filtrar ventas donde el usuario autenticado sea el usuarioVendedor
        this.dataSource = new MatTableDataSource(
          data.filter((venta) => venta.usuarioVendedor.username === this.usuarioAutenticado)
        );
      } else {
        // Administrador y Supervisor ven todo
        this.dataSource = new MatTableDataSource(data);
      }
      this.dataSource.paginator = this.paginator;
    });

    this.vS.getList().subscribe((data) => {
      if (this.rolUsuario === 'Cliente') {
        this.dataSource = new MatTableDataSource(
          data.filter((venta) => venta.usuarioCliente.username === this.usuarioAutenticado)
        );
      } else if (this.rolUsuario === 'Vendedor') {
        this.dataSource = new MatTableDataSource(
          data.filter((venta) => venta.usuarioVendedor.username === this.usuarioAutenticado)
        );
      } else {
        this.dataSource = new MatTableDataSource(data);
      }
    });
  }


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  irACrearVenta() {
    this.router.navigate(['/venta/nuevo']);
  }

  cargarProductosVenta() {
    this.vpS.list().subscribe((data: VentasProducto[]) => {
      this.ventasProductos = data;
    });
  }

  getEstadoVenta(venta: Venta): { texto: string; color: string } {
    if (venta.saldopendiente === 0) {
      return { texto: 'Pagado', color: 'green' };
    } else if (venta.saldopendiente < venta.monto) {
      return { texto: 'Pagando', color: 'orange' };
    } else {
      return { texto: 'Sin pagar', color: 'red' };
    }
  }

  obtenerProductosDeVenta(idVenta: number): VentasProducto[] {
    return this.ventasProductos.filter(p => p.venta.idventa === idVenta);
  }

}
