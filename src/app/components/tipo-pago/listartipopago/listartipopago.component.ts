import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { TipoPago } from '../../../models/tipo-pago';
import { TipoPagoService } from '../../../services/tipo-pago.service';

@Component({
  selector: 'app-listartipopago',
  standalone: true,
  imports: [
    MatSidenavModule,
    CommonModule,
    MatTableModule,
    MatIconModule,
    RouterModule,
    MatPaginator,
  ],
  templateUrl: './listartipopago.component.html',
  styleUrl: './listartipopago.component.css',
})
export class ListartipopagoComponent implements OnInit {
  dataSource: MatTableDataSource<TipoPago> = new MatTableDataSource();
  displayedColumns: string[] = ['c1', 'c2', 'c3', 'accion01', 'accion02'];

  constructor(private tpS: TipoPagoService, private router:Router) {}

  ngOnInit(): void {
    this.tpS.list().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
    });
    this.tpS.getList().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
    });
  }
  eliminar(id: number) {
    this.tpS.delete(id).subscribe((data) => {
      this.tpS.list().subscribe((data) => {
        this.tpS.setList(data);
      });
    });
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  irACrearTipoPago() {
    this.router.navigate(['/tipo-pago/nuevo']);
  }
}

