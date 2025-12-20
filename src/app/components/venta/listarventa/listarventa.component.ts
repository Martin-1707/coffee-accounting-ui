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
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { UsuarioService } from '../../../services/usuario.service';

type Vista = 'cards' | 'table';

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
    MatButtonToggleModule
  ],
  templateUrl: './listarventa.component.html',
  styleUrl: './listarventa.component.css',
})
export class ListarventaComponent implements OnInit {
  dataSource: MatTableDataSource<Venta> = new MatTableDataSource();
  displayedColumns: string[] = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7'];

  usuarioAutenticado: string = '';
  rolUsuario: string = '';
  idUsuarioAuth: number | null = null;

  historialEstados: HistorialEstadoVenta[] = [];
  ventasProductos: VentasProducto[] = [];

  /** Vista actual */
  vista: Vista = 'table';

  // Filtros para la tabla
  estadosVenta: string[] = ['Pagado', 'Pagando', 'Sin pagar']; // o los estados que uses en tu sistema

  // Filtros seleccionados
  estadoSeleccionado: string = '';
  clienteSeleccionado: string = '';
  fechaInicio: Date | null = null;
  fechaFin: Date | null = null;
  q = '';

  // Lista de clientes únicos para el filtro
  clientesUnicos: string[] = [];

  // Backup original para aplicar filtros sin perder datos
  todasLasVentas: Venta[] = [];

  constructor(
    private vS: VentaService,
    private hevS: HistorialEstadoVentaService,
    private vpS: VentasProductoService,
    private router: Router,
    private loginService: LoginService,
    private uS: UsuarioService
  ) { }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.cargarProductosVenta();

    this.rolUsuario = this.loginService.showRole() || '';

    // Traemos el usuario real (id) desde backend
    this.uS.getCurrentUser().subscribe({
      next: (u) => {
        this.idUsuarioAuth = u.idusuario ?? null;

        // Opcional: si también quieres el username real del backend
        // this.usuarioAutenticado = u.username ?? this.loginService.showUser() ?? '';

        // Luego recién cargamos ventas
        this.cargarVentas();
      },
      error: (err) => {
        console.error('Error /usuarios/me', err);
        // Fallback: si falla /me, usa token para no romper
        this.usuarioAutenticado = this.loginService.showUser() || '';
        this.cargarVentas();
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  private cargarVentas() {
    this.vS.list().subscribe((data) => {
      const porRol = this.aplicarFiltroPorRol(data);
      this.todasLasVentas = porRol;

      this.dataSource = new MatTableDataSource(porRol);
      this.dataSource.paginator = this.paginator;

      this.clientesUnicos = Array.from(
        new Set(porRol.map(v => v.usuarioCliente?.username || ''))
      ).filter(Boolean);
    });
  }

  private aplicarFiltroPorRol(data: Venta[]): Venta[] {
    if (!this.idUsuarioAuth) return data;
    if (this.rolUsuario === 'Cliente') {
      return data.filter(v => v.usuarioCliente?.idusuario === this.idUsuarioAuth);
    }
    if (this.rolUsuario === 'Vendedor') {
      return data.filter(v => v.usuarioVendedor?.idusuario === this.idUsuarioAuth);
    }
    return data;
  }

  irACrearVenta() {
    this.router.navigate(['/venta/nuevo']);
  }

  cargarProductosVenta() {
    this.vpS.list().subscribe((data: VentasProducto[]) => {
      this.ventasProductos = data;
    });
  }

  getEstadoVenta(venta: Venta): { texto: 'Pagado' | 'Pagando' | 'Sin pagar'; color: string } {
    if (venta.saldopendiente === 0) {
      return { texto: 'Pagado', color: '#198754' };
    } else if (venta.saldopendiente < venta.monto) {
      return { texto: 'Pagando', color: '#d97706' };
    } else {
      return { texto: 'Sin pagar', color: '#dc2626' };
    }
  }

  estadoChip(estado: string) {
    return {
      'chip--ok': estado === 'Pagado',
      'chip--warn': estado === 'Pagando',
      'chip--bad': estado === 'Sin pagar',
    };
  }

  obtenerProductosDeVenta(idVenta: number): VentasProducto[] {
    return this.ventasProductos.filter(p => p.venta?.idventa === idVenta);
    // si en tu DTO viene id directamente, ajusta a p.idventa
  }

  agregarAbono(venta: Venta) {
    this.router.navigate(['/abonos/nuevo'], { queryParams: { idVenta: venta.idventa } });
  }

  verAbonos(venta: Venta) {
    this.router.navigate(['/abonos/venta', venta.idventa]);
  }

  onSearch(v: string) {
    this.q = (v || '').trim();
    this.aplicarFiltros();
  }

  aplicarFiltros(): void {
    let list = [...this.todasLasVentas];

    // texto
    const q = this.q.toLowerCase();
    if (q) {
      list = list.filter(v =>
        String(v.idventa ?? '').toLowerCase().includes(q) ||
        String(v.usuarioCliente?.nombre ?? '').toLowerCase().includes(q) ||
        String(v.usuarioVendedor?.nombre ?? '').toLowerCase().includes(q)
      );
    }

    // estado
    if (this.estadoSeleccionado) {
      list = list.filter(v => this.getEstadoVenta(v).texto === this.estadoSeleccionado);
    }

    // cliente (usando username; cambia a nombre si prefieres)
    if (this.clienteSeleccionado) {
      list = list.filter(v => v.usuarioCliente?.username === this.clienteSeleccionado);
    }

    // fechas (acepta desde, hasta o ambos; “hasta” inclusivo a 23:59:59)
    if (this.fechaInicio || this.fechaFin) {
      const ini = this.fechaInicio ? new Date(this.fechaInicio) : null;
      const fin = this.fechaFin ? new Date(this.fechaFin) : null;
      if (fin) fin.setHours(23, 59, 59, 999);

      list = list.filter(v => {
        const fv = new Date(v.fechaventa);
        if (ini && !fin) return fv >= ini;
        if (!ini && fin) return fv <= fin;
        if (ini && fin) return fv >= ini && fv <= fin;
        return true;
      });
    }

    this.dataSource = new MatTableDataSource(list);
    this.dataSource.paginator = this.paginator;
  }

  limpiarFiltros(): void {
    this.q = '';
    this.estadoSeleccionado = '';
    this.clienteSeleccionado = '';
    this.fechaInicio = null;
    this.fechaFin = null;

    this.dataSource = new MatTableDataSource(this.todasLasVentas);
    this.dataSource.paginator = this.paginator;
  }

  // Puedes agregar este método para cambiar la vista desde el template
  cambiarVista(vista: Vista) {
    this.vista = vista;
  }
}