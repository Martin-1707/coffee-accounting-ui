import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Abono } from '../../../models/abono';
import { AbonoService } from '../../../services/abono.service';
import { MatCardModule } from '@angular/material/card';
@Component({
  selector: 'app-listarabono',
  standalone: true,
  imports: [
    MatTableModule,
    MatIconModule,
    RouterModule,
    CommonModule,
    MatPaginator,
    MatCardModule
],
  templateUrl: './listarabono.component.html',
  styleUrl: './listarabono.component.css'
})
export class ListarabonoComponent implements OnInit {
  dataSource: MatTableDataSource<Abono> = new MatTableDataSource();
  displayedColumns: string[] = ['c1', 'c2', 'c3','c4','c5'];
  abonosAgrupados: { [key: number]: Abono[] } = {};

  constructor(private aS: AbonoService, private router:Router) {}

  ngOnInit(): void {
    this.aS.list().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.agruparAbonos(data);
    });
    this.aS.getList().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.agruparAbonos(data);
    });
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  irACrearAbono() {
    this.router.navigate(['/abono/nuevo']);
  }

  agruparAbonos(abonos: Abono[]): void {
    this.abonosAgrupados = abonos.reduce((acc, abono) => {
      const idventa = abono.venta.idventa;
      if (!acc[idventa]) {
        acc[idventa] = [];
      }
      acc[idventa].push(abono);
      return acc;
    }, {} as { [key: number]: Abono[] });
  }
}
