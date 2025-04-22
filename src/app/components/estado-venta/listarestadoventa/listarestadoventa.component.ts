import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router, RouterModule } from '@angular/router';
import { EstadoVenta } from '../../../models/estado-venta';
import { EstadoVentaService } from '../../../services/estado-venta.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-listarestadoventa',
  standalone: true,
  imports: [
    MatTableModule,
    MatIconModule,
    RouterModule,
    CommonModule,
    MatPaginator,
    MatCardModule
  ],
  templateUrl: './listarestadoventa.component.html',
  styleUrl: './listarestadoventa.component.css'
})
export class ListarestadoventaComponent implements OnInit {
  //cards
  estados: EstadoVenta[] = [];  // Para las cards
  paginatedEstados: EstadoVenta[] = [];  // Para las cards
  //table
  dataSource: MatTableDataSource<EstadoVenta> = new MatTableDataSource(); // Para la tabla
  displayedColumns: string[] = ['idestado', 'nombreestado'];
  //Cambios
  vista: 'cards' | 'table' = 'cards';  // Vista seleccionada (cards o table)

  @ViewChild('paginatorCards') paginatorCards!: MatPaginator;
  @ViewChild('paginatorTable') paginatorTable!: MatPaginator;

  constructor(private evS: EstadoVentaService, private router: Router) { }

  ngOnInit(): void {
    // Comprobamos la vista actual y cargamos los datos en consecuencia
    if (this.vista === 'table') {
      this.evS.list().subscribe((data) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginatorTable;
      });
      this.evS.getList().subscribe((data) => {
        this.dataSource = new MatTableDataSource(data);
      });
    } else {
      this.evS.list().subscribe((data) => {
        this.estados = data;
        this.updatePaginatedData();
      });
      this.evS.getList().subscribe((data) => {
        this.estados = data;
        this.updatePaginatedData();
      });
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.paginatorCards) {
        this.paginatorCards.page.subscribe(() => this.updatePaginatedData());
        this.updatePaginatedData(); // Asegura que se muestre la página inicial
      }
      if (this.paginatorTable) {
        this.dataSource.paginator = this.paginatorTable;
      }
    });
  }

  updatePaginatedData() {
    if (this.paginatorCards) {
      this.paginatorCards.length = this.estados.length;
      const pageIndex = this.paginatorCards.pageIndex || 0;
      const pageSize = this.paginatorCards.pageSize || 5;
      const startIndex = pageIndex * pageSize;
      const endIndex = startIndex + pageSize;
      this.paginatedEstados = this.estados.slice(startIndex, endIndex);
    }
  }

  // Función para cambiar entre cards y tabla
  cambiarVista(vistaSeleccionada: 'cards' | 'table'): void {
    this.vista = vistaSeleccionada;

    if (this.vista === 'table') {
      this.dataSource = new MatTableDataSource(this.estados);
      setTimeout(() => {
        if (this.paginatorTable) {
          this.dataSource.paginator = this.paginatorTable;
        }
      });
    } else {
      // Volviendo a cards, hay que refrescar la paginación de cards
      setTimeout(() => {
        if (this.paginatorCards) {
          this.paginatorCards.pageIndex = 0; // Reiniciar página al volver a cards
          this.updatePaginatedData();
        }
      });
    }
  }

  // Función para navegar a la página de creación de nuevo estado de venta
  irACrearEstado() {
    this.router.navigate(['/estado-venta/nuevo']);
  }
}