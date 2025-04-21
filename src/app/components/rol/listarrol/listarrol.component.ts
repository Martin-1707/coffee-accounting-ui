import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { Rol } from '../../../models/rol';
import { RolService } from '../../../services/rol.service';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-listarrol',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    RouterModule,
    MatPaginator,
    MatCardModule
  ],
  templateUrl: './listarrol.component.html',
  styleUrl: './listarrol.component.css',
})
export class ListarrolComponent implements OnInit {
  roles: Rol[] = [];
  paginatedRoles: Rol[] = [];
  dataSource: MatTableDataSource<Rol> = new MatTableDataSource();
  displayedColumns: string[] = ['c1', 'c2', 'c3'];

  vista: 'cards' | 'table' = 'cards';

  @ViewChild('paginatorCards') paginatorCards!: MatPaginator;
  @ViewChild('paginatorTable') paginatorTable!: MatPaginator;

  constructor(private rS: RolService, private router: Router) {}

  ngOnInit(): void {
    // Comprobamos la vista actual y cargamos los datos en consecuencia
    if (this.vista === 'table') {
      this.rS.list().subscribe((data) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginatorTable;
      });
      this.rS.getList().subscribe((data) => {
        this.dataSource = new MatTableDataSource(data);
      });
    } else {
      this.rS.list().subscribe((data) => {
        this.roles = data;
        this.updatePaginatedData();
      });
      this.rS.getList().subscribe((data) => {
        this.roles = data;
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
      this.paginatorCards.length = this.roles.length;
      const pageIndex = this.paginatorCards.pageIndex || 0;
      const pageSize = this.paginatorCards.pageSize || 5;
      const startIndex = pageIndex * pageSize;
      const endIndex = startIndex + pageSize;
      this.paginatedRoles = this.roles.slice(startIndex, endIndex);
    }
  }

  // Función para cambiar entre cards y tabla
  cambiarVista(vistaSeleccionada: 'cards' | 'table'): void {
    this.vista = vistaSeleccionada;

    if (this.vista === 'table') {
      this.dataSource = new MatTableDataSource(this.roles);
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

  irACrearRol() {
    this.router.navigate(['/rol/nuevo']);
  }
}
