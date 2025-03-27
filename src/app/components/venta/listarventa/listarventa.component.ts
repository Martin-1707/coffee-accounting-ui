import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { Venta } from '../../../models/venta';
import { VentaService } from '../../../services/venta.service';
import {MatCheckboxModule} from '@angular/material/checkbox';
@Component({
  selector: 'app-listarventa',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    RouterModule,
    MatPaginator,
    MatCheckboxModule
  ],
  templateUrl: './listarventa.component.html',
  styleUrl: './listarventa.component.css',
})
export class ListarventaComponent implements OnInit {
  dataSource: MatTableDataSource<Venta> = new MatTableDataSource();
  displayedColumns: string[] = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6'];

  constructor(private vS: VentaService, private router: Router) {}

  
  ngOnInit(): void {
    this.vS.list().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
    });
    this.vS.getList().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
    });
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  irACrearVenta() {
    this.router.navigate(['/venta/nuevo']);
  }
}
