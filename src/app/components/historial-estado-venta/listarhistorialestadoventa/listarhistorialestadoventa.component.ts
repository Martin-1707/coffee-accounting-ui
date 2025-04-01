import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { HistorialEstadoVenta } from '../../../models/historial-estado-venta';
import { HistorialEstadoVentaService } from '../../../services/historial-estado-venta.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-listarhistorialestadoventa',
  standalone: true,
  imports: [
    MatTableModule,
    MatIconModule,
    RouterModule,
    MatSidenavModule,
    CommonModule,
    MatPaginator,
    MatCardModule,
  ],
  templateUrl: './listarhistorialestadoventa.component.html',
  styleUrl: './listarhistorialestadoventa.component.css',
})
export class ListarhistorialestadoventaComponent implements OnInit {
  historialAgrupado: { [idventa: number]: HistorialEstadoVenta[] } = {};
  paginatedGroups: { key: number; value: HistorialEstadoVenta[] }[] = [];
  allGroups: { key: number; value: HistorialEstadoVenta[] }[] = [];

  constructor(private hevS: HistorialEstadoVentaService) {}

  ngOnInit(): void {
    this.hevS.list().subscribe((data) => {
      this.agruparHistoriales(data);
      this.updatePaginatedData();
    });

    this.hevS.getList().subscribe((data) => {
      this.agruparHistoriales(data);
      this.updatePaginatedData();
    });
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.paginator.page.subscribe(() => this.updatePaginatedData());
      this.updatePaginatedData();
    });
  }

  agruparHistoriales(historiales: HistorialEstadoVenta[]): void {
      this.historialAgrupado = historiales.reduce((acc, historial) => {
        const idventa = historial.venta.idventa;
        if (!acc[idventa]) {
          acc[idventa] = [];
        }
        acc[idventa].push(historial);
        return acc;
      }, {} as { [idventa: number]: HistorialEstadoVenta[] });
  
      // Convertir el objeto en una lista para la paginación
      this.allGroups = Object.entries(this.historialAgrupado).map(([key, value]) => ({
        key: Number(key),
        value
      }));
    }
  
    updatePaginatedData() {
      if (this.paginator) {
        // Configurar la longitud total de los datos para el paginador
        this.paginator.length = this.allGroups.length;
  
        const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
        const endIndex = startIndex + this.paginator.pageSize;
        this.paginatedGroups = this.allGroups.slice(startIndex, endIndex);
      }
    }
  }