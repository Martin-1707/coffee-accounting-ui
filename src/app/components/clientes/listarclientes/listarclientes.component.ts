import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { Usuario } from '../../../models/usuario';
import { UsuarioService } from '../../../services/usuario.service';
import { MatMenuModule } from '@angular/material/menu';
import { LoginService } from '../../../services/login.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CreareditarclientesComponent } from '../creareditarclientes/creareditarclientes.component';

type Vista = 'table' | 'cards';
type EstadoFiltro = 'Todos' | 'Activo' | 'Inactivo';
type VendedorFiltro = 'Todos' | number;

@Component({
  selector: 'app-listarclientes',
  standalone: true,
  imports: [CommonModule,
    MatTableModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatSelectModule,
    MatMenuModule,
    MatDialogModule],
  templateUrl: './listarclientes.component.html',
  styleUrl: './listarclientes.component.css'
})

export class ListarclientesComponent implements OnInit {
  clientes: Usuario[] = [];
  paginatedClientes: Usuario[] = [];
  vendedores: Usuario[] = [];

  usuarioActual?: Usuario;
  vista: Vista = 'table';

  rolActual = '';
  esVendedor = false;

  search = signal<string>('');
  filtroEstado = signal<EstadoFiltro>('Todos');
  filtroVendedor = signal<VendedorFiltro>('Todos');

  displayedColumns = ['cliente', 'vendedor', 'estado', 'acciones'];

  // métricas básicas
  totalClientes = 0;
  activos = 0;
  inactivos = 0;

  private readonly tablePageSizeOptions = [5, 10, 15];
  private readonly cardPageSizeOptions = [4, 8, 12];
  pageSizeOptions: number[] = [...this.tablePageSizeOptions];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private uS: UsuarioService,
    public login: LoginService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.rolActual = (this.login.showRole() ?? '').toLowerCase();
    this.esVendedor = this.rolActual === 'vendedor';

    this.uS.getCurrentUser().subscribe({
      next: u => this.usuarioActual = u,
      error: () => this.usuarioActual = undefined
    });

    if (this.rolActual === 'administrador' || this.rolActual === 'supervisor') {
      this.uS.listVendedores().subscribe({
        next: (data) =>
          this.vendedores = (data ?? []).filter(v => v.rol?.nombre_rol === 'Vendedor'),
        error: () => this.vendedores = [],
      });
    } else {
      this.vendedores = [];
      this.filtroVendedor.set('Todos');
    }

    this.cargarClientesInicial();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (!this.paginator) return;
      this.paginator.pageSize = this.pageSizeOptions[0];
      this.paginator.page.subscribe(() => this.updatePaginatedData());
      this.updatePaginatedData();
    });
  }

  private cargarClientesInicial(): void {
    if (this.rolActual === 'vendedor') {
      this.uS.listMisClientes().subscribe({
        next: (data) => this.setClientes(data ?? []),
        error: () => this.setClientes([]),
      });
      return;
    }

    this.uS.list().subscribe({
      next: (data) => {
        const soloClientes = (data ?? []).filter(u => u.rol?.nombre_rol === 'Cliente');
        this.setClientes(soloClientes);
      },
      error: () => this.setClientes([]),
    });
  }

  private setClientes(lista: Usuario[]): void {
    this.clientes = (lista ?? []).filter(u => u.rol?.nombre_rol === 'Cliente');
    this.recalcularMetricas();
    if (this.paginator) this.paginator.firstPage();
    this.updatePaginatedData();
  }

  private recalcularMetricas(): void {
    this.totalClientes = this.clientes.length;
    this.activos = this.clientes.filter(c => c.enabled === true).length;
    this.inactivos = this.totalClientes - this.activos;
  }

  updatePaginatedData(): void {
    if (!this.paginator) return;
    const filtered = this.filtrarClientes();
    this.paginator.length = filtered.length;

    const start = this.paginator.pageIndex * this.paginator.pageSize;
    const end = start + this.paginator.pageSize;
    this.paginatedClientes = filtered.slice(start, end);
  }

  private filtrarClientes(): Usuario[] {
    const term = this.search().trim().toLowerCase();
    const estado = this.filtroEstado();
    const vendedor = this.filtroVendedor();

    return this.clientes.filter(c => {
      const matchesSearch =
        !term ||
        [c.idusuario, c.nombre, c.apellido]
          .filter(Boolean)
          .some(v => String(v).toLowerCase().includes(term));

      const matchesEstado =
        estado === 'Todos' ||
        (estado === 'Activo' ? c.enabled === true : c.enabled === false);

      const matchesVendedor =
        vendedor === 'Todos' || c.usuarioPadre?.idusuario === vendedor;

      return matchesSearch && matchesEstado && matchesVendedor;
    });
  }

  onSearch(term: string): void {
    this.search.set(term ?? '');
    if (this.paginator) this.paginator.firstPage();
    this.updatePaginatedData();
  }

  onChangeEstado(v: EstadoFiltro): void {
    this.filtroEstado.set(v);
    if (this.paginator) this.paginator.firstPage();
    this.updatePaginatedData();
  }

  onChangeVendedor(v: VendedorFiltro): void {
    this.filtroVendedor.set(v);

    if (this.rolActual === 'vendedor') {
      if (this.paginator) this.paginator.firstPage();
      this.updatePaginatedData();
      return;
    }

    if (v === 'Todos') {
      this.cargarClientesInicial();
    } else {
      this.uS.listClientesPorVendedor(Number(v)).subscribe({
        next: (data) => this.setClientes(data ?? []),
        error: () => this.setClientes([]),
      });
    }
  }

  cambiarVista(v: Vista): void {
    this.vista = v;

    const src = v === 'table' ? this.tablePageSizeOptions : this.cardPageSizeOptions;
    // importante: mutar, no reemplazar referencia (evita NG0956)
    this.pageSizeOptions.splice(0, this.pageSizeOptions.length, ...src);

    setTimeout(() => {
      if (this.paginator) {
        this.paginator.pageSize = this.pageSizeOptions[0];
        this.paginator.firstPage();
        this.updatePaginatedData();
      }
    });
  }

  abrirNuevoCliente(): void {
    const ref = this.dialog.open(CreareditarclientesComponent, {
      width: '560px',
      maxWidth: '92vw',
      panelClass: 'purchase-dialog',
      backdropClass: 'purchase-backdrop',
      autoFocus: false,
    });

    ref.afterClosed().subscribe((res) => {
      if (res === 'saved') {
        this.cargarClientesInicial();
      }
    });
  }

  editarCliente(c: Usuario): void {
    const ref = this.dialog.open(CreareditarclientesComponent, {
      width: '560px',
      maxWidth: '92vw',
      data: c,
      panelClass: 'purchase-dialog',
      backdropClass: 'purchase-backdrop',
      autoFocus: false,
    });

    ref.afterClosed().subscribe((res) => {
      if (res === 'saved') this.cargarClientesInicial();
    });
  }

  toggleEstado(c: Usuario): void {
    const actualizado: Usuario = { ...c, enabled: !c.enabled };
    this.uS.update(actualizado).subscribe({
      next: () => this.cargarClientesInicial(),
    });
  }

  trackByClienteId(index: number, c: Usuario): number {
    return c.idusuario;
  }

  formatDate(d?: any): string {
    if (!d) return '—';
    const date = new Date(d);
    if (isNaN(date.getTime())) return String(d);
    return date.toLocaleDateString('es-PE');
  }
}