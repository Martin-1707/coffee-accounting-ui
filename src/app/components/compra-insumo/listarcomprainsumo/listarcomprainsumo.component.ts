import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { CompraInsumoService } from '../../../services/compra-insumo.service';
import { CompraInsumo } from '../../../models/compra-insumo';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CreareditarcomprainsumoComponent } from '../creareditarcomprainsumo/creareditarcomprainsumo.component';

type Vista = 'cards' | 'table';

@Component({
  selector: 'app-listarcomprainsumo',
  standalone: true,
  imports: [
    MatTableModule,
    MatIconModule,
    RouterModule,
    CommonModule,
    MatCardModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatInputModule,
    MatDialogModule
  ],
  templateUrl: './listarcomprainsumo.component.html',
  styleUrl: './listarcomprainsumo.component.css',
})
export class ListarcomprainsumoComponent implements OnInit {
  compras: CompraInsumo[] = [];
  paginatedCompras: CompraInsumo[] = [];

  /** Vista actual */
  vista: Vista = 'table';

  /** Búsqueda */
  search = signal<string>('');

  /** Columnas (tabla) */
  displayedColumns = ['idcompra', 'rango', 'monto', 'usuario', 'registro'];

  // Opciones de página para cada vista
  private readonly tablePageSizeOptions = [5, 10, 15];
  private readonly cardPageSizeOptions = [4, 8, 12];

  // Esta es la que se bindea al mat-paginator
  pageSizeOptions: number[] = [...this.tablePageSizeOptions];


  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private ciS: CompraInsumoService, private router: Router, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.ciS.list().subscribe((data) => {
      this.compras = data;
      this.updatePaginatedData();
    });

    // Escuchar cambios para actualizar la lista en tiempo real
    this.ciS.getList().subscribe((data) => {
      this.compras = data;
      this.updatePaginatedData();
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      // tamaño inicial de página según vista por defecto ('table')
      this.paginator.pageSize = this.pageSizeOptions[0];

      this.paginator.page.subscribe(() => this.updatePaginatedData());
      this.updatePaginatedData();
    });
  }


  // 🔹 Nuevo: abrir el modal del formulario
  abrirRegistro() {
    const ref = this.dialog.open(CreareditarcomprainsumoComponent, {
      width: '560px',
      maxWidth: '92vw',
      panelClass: 'purchase-dialog',      // 👈 Usa las clases globales
      backdropClass: 'purchase-backdrop', // 👈 fondo translúcido café
      autoFocus: false
    });

    ref.afterClosed().subscribe((res) => {
      if (res === 'saved') {
        // Refresca la lista si se guardó algo
        this.ciS.list().subscribe((d) => this.ciS.setList(d));
      }
    });
  }

  // 🔹 Ya no navega, ahora abrimos el modal
  irACrearCompra() {
    this.abrirRegistro();
  }


  // irACrearCompra() {
  //   this.router.navigate(['/compra-insumo/nuevo']);
  // }

  /** ==== Lógica ==== */
  updatePaginatedData() {
    if (!this.paginator) return;
    const filtered = this.filterCompras();
    this.paginator.length = filtered.length;
    const start = this.paginator.pageIndex * this.paginator.pageSize;
    const end = start + this.paginator.pageSize;
    this.paginatedCompras = filtered.slice(start, end);
  }

  filterCompras(): CompraInsumo[] {
    const term = this.search().trim().toLowerCase();
    if (!term) return this.compras;
    return this.compras.filter(c =>
      [
        c.idcompra,
        c.usuario?.nombre ?? '',
        c.monto,
        c.fecha_inicial,
        c.fecha_final,
      ].some(v => String(v).toLowerCase().includes(term))
    );
  }

  onSearch(term: string) {
    this.search.set(term);
    this.paginator.firstPage();
    this.updatePaginatedData();
  }

  cambiarVista(vista: Vista) {
    this.vista = vista;

    // Elegimos las opciones según la vista
    const source = vista === 'table'
      ? this.tablePageSizeOptions
      : this.cardPageSizeOptions;

    // Mutamos el array existente para NO cambiar la referencia
    this.pageSizeOptions.splice(0, this.pageSizeOptions.length, ...source);

    setTimeout(() => {
      if (this.paginator) {
        this.paginator.pageSize = this.pageSizeOptions[0];
        this.paginator.firstPage();
        this.updatePaginatedData();
      }
    });
  }



  formatMoney(n?: number): string {
    if (n == null) return '';
    return n.toLocaleString('es-PE', { style: 'currency', currency: 'PEN' });
  }

  formatDate(d?: Date | string): string {
    if (!d) return '';
    const date = new Date(d);
    return date.toLocaleDateString('es-PE');
  }

  estadoClass(estado?: string): string {
    const e = (estado ?? '').toLowerCase();
    if (e.includes('pend')) return 'chip chip-warn';
    if (e.includes('compl')) return 'chip chip-success';
    return 'chip';
  }

  trackByCompraId(index: number, item: CompraInsumo) {
    return item.idcompra;
  }
}
