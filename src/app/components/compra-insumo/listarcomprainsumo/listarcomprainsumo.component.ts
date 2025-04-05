import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CompraInsumoService } from '../../../services/compra-insumo.service';
import { CompraInsumo } from '../../../models/compra-insumo';
import { MatPaginator } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CommonModule } from '@angular/common';
import { SidenavComponent } from '../../sidenav/sidenav.component';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-listarcomprainsumo',
  standalone: true,
  imports: [
    MatTableModule,
    MatIconModule,
    RouterModule,
    MatSidenavModule,
    CommonModule,
    MatPaginator,
    MatCardModule
  ],
  templateUrl: './listarcomprainsumo.component.html',
  styleUrl: './listarcomprainsumo.component.css',
})
export class ListarcomprainsumoComponent implements OnInit {
  compras: CompraInsumo[] = [];
  paginatedCompras: CompraInsumo[] = [];

  constructor(private ciS: CompraInsumoService, private router:Router) {}

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

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.paginator.page.subscribe(() => this.updatePaginatedData());
      this.updatePaginatedData();
    });
  }

  irACrearCompra() {
    this.router.navigate(['/compra-insumo/nuevo']);
  }

  updatePaginatedData() {
    if (this.paginator) {
      this.paginator.length = this.compras.length;
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      const endIndex = startIndex + this.paginator.pageSize;
      this.paginatedCompras = this.compras.slice(startIndex, endIndex);
    }
  }
}
