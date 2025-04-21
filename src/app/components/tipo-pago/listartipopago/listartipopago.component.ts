import { Component, OnInit, ViewChild, AfterViewInit, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { TipoPago } from '../../../models/tipo-pago';
import { TipoPagoService } from '../../../services/tipo-pago.service';
import { MatCardModule } from '@angular/material/card';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-listartipopago',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    RouterModule,
    MatPaginator,
    MatCardModule
  ],
  templateUrl: './listartipopago.component.html',
  styleUrl: './listartipopago.component.css',
})
export class ListartipopagoComponent implements OnInit, AfterViewInit, AfterViewChecked {
  tipopagos: TipoPago[] = [];
  paginatedTipoPago: TipoPago[] = [];
  dataSource: MatTableDataSource<TipoPago> = new MatTableDataSource();
  displayedColumns: string[] = ['c1', 'c2', 'c3'];
  vista: 'cards' | 'table' = 'cards';

  @ViewChild('paginatorCards') paginatorCards!: MatPaginator;
  @ViewChild('paginatorTable') paginatorTable!: MatPaginator;

  private paginatorCardsSubscribed = false;
  private paginatorCardsSubscription?: Subscription;

  constructor(private tpS: TipoPagoService, private router: Router) { }

  ngOnInit(): void {
    this.tpS.list().subscribe((data) => {
      this.tipopagos = data;
      this.dataSource = new MatTableDataSource(this.tipopagos);
      this.updatePaginatedData();
    });
  }

  ngAfterViewInit(): void {
    // Table paginator
    if (this.paginatorTable) {
      this.dataSource.paginator = this.paginatorTable;
    }
  }

  ngAfterViewChecked(): void {
    // Cards paginator: suscribirse solo si estamos en cards y no está suscrito
    if (this.vista === 'cards' && this.paginatorCards && !this.paginatorCardsSubscribed) {
      this.paginatorCardsSubscription = this.paginatorCards.page.subscribe(() => this.updatePaginatedData());
      this.paginatorCardsSubscribed = true;
      this.paginatorCards.pageIndex = 0;
      this.updatePaginatedData();
    }
    // Si cambiamos a tabla, limpiar la suscripción
    if (this.vista === 'table' && this.paginatorCardsSubscribed) {
      this.paginatorCardsSubscription?.unsubscribe();
      this.paginatorCardsSubscribed = false;
    }
  }

  updatePaginatedData(): void {
    if (this.paginatorCards) {
      const pageIndex = this.paginatorCards.pageIndex || 0;
      const pageSize = this.paginatorCards.pageSize || 4;
      const startIndex = pageIndex * pageSize;
      const endIndex = startIndex + pageSize;
      this.paginatedTipoPago = this.tipopagos.slice(startIndex, endIndex);
      this.paginatorCards.length = this.tipopagos.length;
    }
  }

  cambiarVista(vistaSeleccionada: 'cards' | 'table'): void {
    this.vista = vistaSeleccionada;
    if (this.vista === 'table') {
      this.dataSource = new MatTableDataSource(this.tipopagos);
      setTimeout(() => {
        if (this.paginatorTable) {
          this.dataSource.paginator = this.paginatorTable;
        }
      });
    } else {
      setTimeout(() => {
        if (this.paginatorCards) {
          this.paginatorCards.pageIndex = 0;
          this.updatePaginatedData();
        }
      });
    }
  }

  irACrearTipoPago(): void {
    this.router.navigate(['/tipo-pago/nuevo']);
  }
}

