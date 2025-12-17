import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Abono } from '../../../models/abono';
import { AbonoService } from '../../../services/abono.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButtonModule } from '@angular/material/button';

type Vista = 'table' | 'cards';

interface ResumenVentaAbonos {
  idventa: number;
  cliente: string;
  totalVenta: number;
  saldoPendiente: number;
  abonos: Abono[];
  sumaAbonos: number;       // ← se calcula sumando los abonos
  estado: 'Completado' | 'Parcial'; // ← se infiere según saldoPendiente
  fechaUltimo?: Date;
}

@Component({
  selector: 'app-listarabono',
  standalone: true,
  imports: [
    MatTableModule,
    MatIconModule,
    RouterModule,
    CommonModule,
    MatPaginator,
    MatCardModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonToggleModule,
    MatButtonModule
  ],
  templateUrl: './listarabono.component.html',
  styleUrl: './listarabono.component.css'
})
export class ListarabonoComponent implements OnInit {
  /** Datos base */
  private abonos: Abono[] = [];

  /** Resumen por venta */
  resumenes: ResumenVentaAbonos[] = [];
  pageResumenes: ResumenVentaAbonos[] = [];

  /** UI */
  vista: Vista = 'table';
  search = '';
  length = 0;

  /** Caso “ver abonos de una venta concreta” */
  esVistaVentaEspecifica = false;

  displayedColumns = ['venta', 'cliente', 'fecha', 'suma', 'total', 'restante', 'estado'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private aS: AbonoService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const idventaParam = this.route.snapshot.paramMap.get('idventa');
    this.esVistaVentaEspecifica = !!idventaParam;

    if (idventaParam) {
      const idventa = parseInt(idventaParam, 10);
      this.aS.getAbonosPorVenta(idventa).subscribe(data => {
        this.abonos = data ?? [];
        this.recalcularResumen();
        this.actualizarPagina();
      });
    } else {
      this.aS.list().subscribe(data => {
        this.abonos = data ?? [];
        this.recalcularResumen();
        this.actualizarPagina();
      });
      this.aS.getList().subscribe(data => {
        this.abonos = data ?? [];
        this.recalcularResumen();
        this.actualizarPagina();
      });
    }
  }

  ngAfterViewInit(): void {
    if (!this.esVistaVentaEspecifica) {
      setTimeout(() => {
        this.paginator.page.subscribe(() => this.actualizarPagina());
        this.actualizarPagina();
      });
    }
  }

  /** Construye la lista de ResumenVentaAbonos desde this.abonos */
  private recalcularResumen(): void {
    const grupos = new Map<number, Abono[]>();
    for (const a of this.abonos) {
      const k = a.venta?.idventa ?? 0;
      if (!grupos.has(k)) grupos.set(k, []);
      grupos.get(k)!.push(a);
    }

    const res: ResumenVentaAbonos[] = [];
    for (const [idventa, lista] of grupos.entries()) {
      const v = lista[0]?.venta;
      const cliente = v?.usuarioCliente?.nombre ?? v?.usuarioCliente?.nombre ?? '—';
      const totalVenta = Number(v?.monto ?? 0);
      const saldoPendiente = Number(v?.saldopendiente ?? 0);
      const sumaAbonos = lista.reduce((s, x) => s + Number(x.monto ?? 0), 0);
      const estado: 'Completado' | 'Parcial' = saldoPendiente === 0 ? 'Completado' : 'Parcial';
      const fechaUltimo = lista
        .map(x => new Date(x.fecha_abono as any))
        .sort((a, b) => b.getTime() - a.getTime())[0];

      res.push({
        idventa,
        cliente,
        totalVenta,
        saldoPendiente,
        abonos: lista,
        sumaAbonos,
        estado,
        fechaUltimo
      });
    }

    // orden opcional por fecha de último abono desc
    res.sort((a, b) => (b.fechaUltimo?.getTime() ?? 0) - (a.fechaUltimo?.getTime() ?? 0));

    // filtro por búsqueda
    const t = this.search.trim().toLowerCase();
    this.resumenes = t
      ? res.filter(r =>
        String(r.idventa).includes(t) ||
        r.cliente.toLowerCase().includes(t)
      )
      : res;

    this.length = this.resumenes.length;
  }

  private actualizarPagina(): void {
    if (this.esVistaVentaEspecifica) {
      this.pageResumenes = this.resumenes;
      return;
    }
    if (!this.paginator) {
      this.pageResumenes = this.resumenes.slice(0, 6);
      return;
    }
    const start = this.paginator.pageIndex * this.paginator.pageSize;
    const end = start + this.paginator.pageSize;
    this.pageResumenes = this.resumenes.slice(start, end);
  }

  onSearch(v: string) {
    this.search = v || '';
    this.recalcularResumen();
    if (!this.esVistaVentaEspecifica) this.paginator.firstPage();
    this.actualizarPagina();
  }

  cambiarVista(v: Vista) {
    this.vista = v;
  }

  irACrearAbono() {
    this.router.navigate(['/abonos/nuevo']);
  }

  volverAVentas() {
    this.router.navigate(['/venta']);
  }

  /** Helpers de formato */
  money(n?: number): string {
    if (n == null) return 'S/ 0.00';
    return n.toLocaleString('es-PE', { style: 'currency', currency: 'PEN' });
  }
  date(d?: Date): string {
    if (!d) return '';
    return new Date(d).toLocaleDateString('es-PE');
  }

  /** Métricas (encabezado) */
  totalAbonos(): number {
    return this.abonos.reduce((s, a) => s + Number(a.monto ?? 0), 0);
  }
  conteoCompletados(): number {
    return this.resumenes.filter(r => r.estado === 'Completado').length;
  }
  conteoParciales(): number {
    return this.resumenes.filter(r => r.estado === 'Parcial').length;
  }
}