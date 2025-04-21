import { CommonModule } from '@angular/common';
import { AfterViewChecked, AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { VentasProducto } from '../../../models/ventas-producto';
import { VentasProductoService } from '../../../services/ventas-producto.service';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-listarventasproducto',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    RouterModule,
    MatPaginator,
    MatCardModule,
    MatDividerModule
  ],
  templateUrl: './listarventasproducto.component.html',
  styleUrl: './listarventasproducto.component.css',
})
export class ListarventasproductoComponent implements OnInit, AfterViewInit, AfterViewChecked {

  private viewInitialized = false;

  abonosAgrupados: { [idventa: number]: VentasProducto[] } = {};
  paginatedGroups: { key: number; value: VentasProducto[] }[] = [];
  allGroups: { key: number; value: VentasProducto[] }[] = [];

  dataSource: MatTableDataSource<VentasProducto> = new MatTableDataSource();
  groupedData: { key: number; value: VentasProducto[] }[] = [];
  displayedColumns: string[] = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6'];

  vista: 'cards' | 'table' = 'cards';

  VentasProducto: VentasProducto[] = [];
  @ViewChild('paginatorCards') paginatorCards!: MatPaginator;
  @ViewChild('paginatorTable') paginatorTable!: MatPaginator;

  constructor(private vpS: VentasProductoService) { }

  ngOnInit(): void {
    // Carga inicial para ambos
    this.vpS.list().subscribe((data) => {
      this.procesarDatos(data);
    });
  
    // Suscripción para detectar cambios en tiempo real
    this.vpS.getList().subscribe((data) => {
      this.procesarDatos(data);
    });
  }
  
  procesarDatos(data: VentasProducto[]): void {
    this.VentasProducto = data.sort((a, b) => a.venta.idventa - b.venta.idventa);
    this.agruparVentasProducto(this.VentasProducto);
    
    if (this.vista === 'table') {
      if (this.paginatorTable) {
        this.paginatorTable.pageSize = this.paginatorTable.pageSize || 5;
        this.paginatorTable.length = this.allGroups.length;
      }
    }
    
    this.updatePaginatedData();
  }

  agruparVentasProducto(abonos: VentasProducto[]): void {
    this.abonosAgrupados = abonos.reduce((acc, abono) => {
      const idventa = abono.venta.idventa;
      if (!acc[idventa]) {
        acc[idventa] = [];
      }
      acc[idventa].push(abono);
      return acc;
    }, {} as { [idventa: number]: VentasProducto[] });
    // Convertir el objeto en una lista para la paginación
    this.allGroups = Object.entries(this.abonosAgrupados).map(([key, value]) => ({
      key: Number(key),
      value
    }));
  }

  ngAfterViewInit(): void {
    this.subscribeToPaginators();
    this.viewInitialized = true;
    this.updatePaginatedData();
  }

  ngAfterViewChecked(): void {
    if (this.viewInitialized) {
      // Volver a asignar suscripciones si la vista cambia
      this.subscribeToPaginators();
    }
  }

  subscribeToPaginators(): void {
    if (this.vista === 'cards' && this.paginatorCards) {
      this.paginatorCards.page.subscribe(() => this.updatePaginatedData());
    }

    if (this.vista === 'table' && this.paginatorTable) {
      this.paginatorTable.page.subscribe(() => this.updatePaginatedData());
    }
  }

  updatePaginatedData(): void {
    const currentPaginator = this.vista === 'cards' ? this.paginatorCards : this.paginatorTable;
    
    if (currentPaginator) {
      // Asegurarse de que la longitud total sea correcta
      currentPaginator.length = this.allGroups.length;
      
      // Calcular el rango de elementos a mostrar
      const startIndex = currentPaginator.pageIndex * currentPaginator.pageSize;
      const endIndex = startIndex + currentPaginator.pageSize;
      
      // Actualizar los grupos paginados
      this.paginatedGroups = this.allGroups.slice(startIndex, endIndex);
    }
  }

  // Función para cambiar entre cards y tabla
  cambiarVista(vistaSeleccionada: 'cards' | 'table'): void {
    this.vista = vistaSeleccionada;

    // Esperar a que el DOM renderice completamente el nuevo paginador
    setTimeout(() => {
      const currentPaginator = this.vista === 'cards' ? this.paginatorCards : this.paginatorTable;

      if (currentPaginator) {
        currentPaginator.pageIndex = 0;
        currentPaginator.pageSize = this.vista === 'cards' ? 4 : 5;
        currentPaginator.length = this.allGroups.length;
        this.updatePaginatedData();
      }
    });
  }
}

