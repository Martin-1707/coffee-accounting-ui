import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { HistorialPrecioProducto } from '../../../models/historial-precio-producto';
import { HistorialPrecioProductoService } from '../../../services/historial-precio-producto.service';

@Component({
  selector: 'app-listar-historial-precio-producto',
  standalone: true,
  imports: [
    MatTableModule,
    MatIconModule,
    RouterModule,
    CommonModule,
    MatPaginator,
    MatCardModule,],
  templateUrl: './listar-historial-precio-producto.component.html',
  styleUrl: './listar-historial-precio-producto.component.css'
})
export class ListarHistorialPrecioProductoComponent {
  historialAgrupado: { [idProducto: number]: HistorialPrecioProducto[] } = {};
  paginatedGroups: { key: number; value: HistorialPrecioProducto[] }[] = [];
  allGroups: { key: number; value: HistorialPrecioProducto[] }[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private hppS: HistorialPrecioProductoService) {}

  ngOnInit(): void {
    this.hppS.list().subscribe((data) => {
      this.agruparHistorial(data);
      this.updatePaginatedData();
    });

    this.hppS.getList().subscribe((data) => {
      this.agruparHistorial(data);
      this.updatePaginatedData();
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.paginator.page.subscribe(() => this.updatePaginatedData());
      this.updatePaginatedData();
    });
  }

  agruparHistorial(historiales: HistorialPrecioProducto[]): void {
    this.historialAgrupado = historiales.reduce((acc, historial) => {
      const idProducto = historial.producto.idproducto;
      if (!acc[idProducto]) {
        acc[idProducto] = [];
      }
      acc[idProducto].push(historial);
      return acc;
    }, {} as { [idProducto: number]: HistorialPrecioProducto[] });

    this.allGroups = Object.entries(this.historialAgrupado).map(([key, value]) => ({
      key: Number(key),
      value
    }));
  }

  updatePaginatedData() {
    if (this.paginator) {
      this.paginator.length = this.allGroups.length;
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      const endIndex = startIndex + this.paginator.pageSize;
      this.paginatedGroups = this.allGroups.slice(startIndex, endIndex);
    }
  }
}