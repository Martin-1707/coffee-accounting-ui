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
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
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
    MatMenuModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
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

  modoTarjeta: boolean = true;

  // Filtros para la tabla
  estadosVenta: string[] = ['Pagado', 'Pagando', 'Sin pagar']; // o los estados que uses en tu sistema

  // Filtros seleccionados
  estadoSeleccionado: string = '';
  clienteSeleccionado: string = '';
  fechaInicio: Date | null = null;
  fechaFin: Date | null = null;

  // Lista de clientes únicos para el filtro
  clientesUnicos: string[] = [];

  // Backup original para aplicar filtros sin perder datos
  todasLasVentas: Venta[] = [];

  constructor(private vS: VentaService, private hevS: HistorialEstadoVentaService, private vpS: VentasProductoService, private router: Router, private loginService: LoginService) { }

  ngOnInit(): void {

    this.cargarProductosVenta();

    this.usuarioAutenticado = this.loginService.showUser() || '';
    this.rolUsuario = this.loginService.showRole() || '';

    this.vS.list().subscribe((data) => {
      let ventasFiltradas: Venta[] = [];

      if (this.rolUsuario === 'Cliente') {
        ventasFiltradas = data.filter((venta) => venta.usuarioCliente.username === this.usuarioAutenticado);
      } else if (this.rolUsuario === 'Vendedor') {
        ventasFiltradas = data.filter((venta) => venta.usuarioVendedor.username === this.usuarioAutenticado);
      } else {
        ventasFiltradas = data;
      }

      this.todasLasVentas = ventasFiltradas; // Guardamos para filtros
      this.dataSource = new MatTableDataSource(ventasFiltradas);
      this.dataSource.paginator = this.paginator;

      // Extraer clientes únicos para el filtro
      this.clientesUnicos = Array.from(
        new Set(ventasFiltradas.map(v => v.usuarioCliente.username))
      );
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

  agregarAbono(venta: Venta) {
    // Aquí puedes redirigir a un componente o abrir un diálogo para agregar abono
    this.router.navigate(['/abonos/nuevo'], { queryParams: { idVenta: venta.idventa } });
  }

  verAbonos(venta: Venta) {
    this.router.navigate(['/abonos/venta', venta.idventa]);
  }

  aplicarFiltros(): void {
    let ventasFiltradas = [...this.todasLasVentas];

    // Filtro por estado
    if (this.estadoSeleccionado) {
      ventasFiltradas = ventasFiltradas.filter(v => {
        const estado = this.getEstadoVenta(v).texto;
        return estado === this.estadoSeleccionado;
      });
    }

    // Filtro por cliente
    if (this.clienteSeleccionado) {
      ventasFiltradas = ventasFiltradas.filter(v =>
        v.usuarioCliente.username === this.clienteSeleccionado
      );
    }

    // Filtro por rango de fechas
    if (this.fechaInicio && this.fechaFin) {
      ventasFiltradas = ventasFiltradas.filter(v => {
        const fechaVenta = new Date(v.fechaventa); // Asegúrate que `fechaventa` es una fecha válida
        return fechaVenta >= this.fechaInicio! && fechaVenta <= this.fechaFin!;
      });
    }

    // Aplicar resultado filtrado
    this.dataSource = new MatTableDataSource(ventasFiltradas);
    this.dataSource.paginator = this.paginator;
  }

  onCambioFiltro(): void {
    this.aplicarFiltros();
  }

  limpiarFiltros(): void {
    this.estadoSeleccionado = '';
    this.clienteSeleccionado = '';
    this.fechaInicio = null;
    this.fechaFin = null;

    // Restaurar ventas originales sin filtros
    this.dataSource = new MatTableDataSource(this.todasLasVentas);
    this.dataSource.paginator = this.paginator;
  }

}
