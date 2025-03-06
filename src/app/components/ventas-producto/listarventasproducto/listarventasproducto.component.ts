import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { SidenavComponent } from '../../sidenav/sidenav.component';
import { VentasProducto } from '../../../models/ventas-producto';
import { VentasProductoService } from '../../../services/ventas-producto.service';

@Component({
  selector: 'app-listarventasproducto',
  standalone: true,
  imports: [
    SidenavComponent,
    MatSidenavModule,
    CommonModule,
    MatTableModule,
    MatIconModule,
    RouterModule,
    MatPaginator,
  ],
  templateUrl: './listarventasproducto.component.html',
  styleUrl: './listarventasproducto.component.css',
})
export class ListarventasproductoComponent  implements OnInit {
  dataSource: MatTableDataSource<VentasProducto> = new MatTableDataSource();
  displayedColumns: string[] = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6'];

  constructor(private vpS: VentasProductoService) {}

  
  ngOnInit(): void {
    this.vpS.list().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
    });
    this.vpS.getList().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
    });
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}

