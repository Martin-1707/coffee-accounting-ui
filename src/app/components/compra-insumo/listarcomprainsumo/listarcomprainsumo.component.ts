import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CompraInsumoService } from '../../../services/compra-insumo.service';
import { CompraInsumo } from '../../../models/compra-insumo';
import { MatPaginator } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CommonModule } from '@angular/common';
import { SidenavComponent } from '../../sidenav/sidenav.component';

@Component({
  selector: 'app-listarcomprainsumo',
  standalone: true,
  imports: [
    MatTableModule,
    MatIconModule,
    RouterModule,
    MatSidenavModule,
    CommonModule,
    SidenavComponent,
    MatPaginator,
  ],
  templateUrl: './listarcomprainsumo.component.html',
  styleUrl: './listarcomprainsumo.component.css',
})
export class ListarcomprainsumoComponent implements OnInit {
  dataSource: MatTableDataSource<CompraInsumo> = new MatTableDataSource();
  displayedColumns: string[] = ['c1', 'c2', 'c3', 'c4'];

  constructor(private ciS: CompraInsumoService) {}

  ngOnInit(): void {
    this.ciS.list().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
    });
    this.ciS.getList().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
    });
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}
