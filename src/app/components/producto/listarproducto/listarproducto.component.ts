import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { Router, RouterModule } from '@angular/router';
import { Producto } from '../../../models/producto';
import { ProductoService } from '../../../services/producto.service';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-listarproducto',
  standalone: true,
  imports: [
    MatSidenavModule,
    CommonModule,
    MatTableModule,
    MatIconModule,
    RouterModule,
    MatPaginator,
    MatCardModule
  ],
  templateUrl: './listarproducto.component.html',
  styleUrl: './listarproducto.component.css',
})
export class ListarproductoComponent implements OnInit, AfterViewInit {
  productos: Producto[] = []; // Lista completa de productos
  productosPaginados: Producto[] = []; // Productos visibles en la página actual
  length = 0; // Total de productos

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private pS: ProductoService, private router: Router) {}

  ngOnInit(): void {
    this.pS.list().subscribe((data) => {
      this.productos = data;
      this.length = data.length; // Asignar el total de productos
      this.actualizarProductosPaginados();
    });
  }

  ngAfterViewInit(): void {
    this.paginator.page.subscribe(() => {
      this.actualizarProductosPaginados();
    });
  }

  actualizarProductosPaginados() {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    const endIndex = startIndex + this.paginator.pageSize;
    this.productosPaginados = this.productos.slice(startIndex, endIndex);
  }

  irACrearProducto(){
    this.router.navigate(['/producto/nuevo']);
  }
}
