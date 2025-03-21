import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { SidenavComponent } from '../../sidenav/sidenav.component';
import { EstadoVenta } from '../../../models/estado-venta';
import { EstadoVentaService } from '../../../services/estado-venta.service';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-listarestadoventa',
  standalone: true,
  imports: [
      MatTableModule,
      MatIconModule,
      RouterModule,
      MatSidenavModule,
      CommonModule,
      MatPaginator
    ],
  templateUrl: './listarestadoventa.component.html',
  styleUrl: './listarestadoventa.component.css'
})
export class ListarestadoventaComponent  implements OnInit {
  dataSource: MatTableDataSource<EstadoVenta> = new MatTableDataSource();
  displayedColumns: string[] = ['c1', 'c2'];

  constructor(private evS: EstadoVentaService) {}

  ngOnInit(): void {
    this.evS.list().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
    });
    this.evS.getList().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
    });
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}