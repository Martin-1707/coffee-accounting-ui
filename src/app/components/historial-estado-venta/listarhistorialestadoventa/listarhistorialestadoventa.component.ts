import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { HistorialEstadoVenta } from '../../../models/historial-estado-venta';
import { HistorialEstadoVentaService } from '../../../services/historial-estado-venta.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CommonModule } from '@angular/common';
import { SidenavComponent } from '../../sidenav/sidenav.component';

@Component({
  selector: 'app-listarhistorialestadoventa',
  standalone: true,
  imports: [
      MatTableModule,
      MatIconModule,
      RouterModule,
      MatSidenavModule,
      CommonModule,
      SidenavComponent,
      MatPaginator,],
  templateUrl: './listarhistorialestadoventa.component.html',
  styleUrl: './listarhistorialestadoventa.component.css'
})
export class ListarhistorialestadoventaComponent  implements OnInit {
  dataSource: MatTableDataSource<HistorialEstadoVenta> = new MatTableDataSource();
  displayedColumns: string[] = ['c1', 'c2', 'c3', 'c4'];

  constructor(private hevS: HistorialEstadoVentaService) {}

  ngOnInit(): void {
    this.hevS.list().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
    });
    this.hevS.getList().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
    });
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}
