import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
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
    MatCardModule,
  ],
  templateUrl: './listarabono.component.html',
  styleUrl: './listarabono.component.css'
})
export class ListarabonoComponent implements OnInit {
  abonosAgrupados: { [idventa: number]: Abono[] } = {};
  paginatedGroups: { key: number; value: Abono[] }[] = [];
  allGroups: { key: number; value: Abono[] }[] = [];

  esVistaVentaEspecifica = false;

  constructor(private aS: AbonoService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    const idventaParam = this.route.snapshot.paramMap.get('idventa');

    this.esVistaVentaEspecifica = !!idventaParam; // true si existe idventa

    if (idventaParam) {
      const idventa = parseInt(idventaParam, 10);
      this.aS.getAbonosPorVenta(idventa).subscribe((data) => {
        this.agruparAbonos(data);
        this.updatePaginatedData();
      });
    } else {
      this.aS.list().subscribe((data) => {
        this.agruparAbonos(data);
        this.updatePaginatedData();
      });

      this.aS.getList().subscribe((data) => {
        this.agruparAbonos(data);
        this.updatePaginatedData();
      });
    }
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngAfterViewInit(): void {
    if (!this.esVistaVentaEspecifica) {
      setTimeout(() => {
        this.paginator.page.subscribe(() => this.updatePaginatedData());
        this.updatePaginatedData();
      });
    }
  }

  irACrearAbono() {
    this.router.navigate(['/abonos/nuevo']);
  }

  agruparAbonos(abonos: Abono[]): void {
    this.abonosAgrupados = abonos.reduce((acc, abono) => {
      const idventa = abono.venta.idventa;
      if (!acc[idventa]) {
        acc[idventa] = [];
      }
      acc[idventa].push(abono);
      return acc;
    }, {} as { [idventa: number]: Abono[] });

    // Convertir el objeto en una lista para la paginación
    this.allGroups = Object.entries(this.abonosAgrupados).map(([key, value]) => ({
      key: Number(key),
      value
    }));
  }

  updatePaginatedData() {
    if (this.esVistaVentaEspecifica) {
      // Mostrar todos sin paginar
      this.paginatedGroups = this.allGroups;
    } else if (this.paginator) {
      this.paginator.length = this.allGroups.length;
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      const endIndex = startIndex + this.paginator.pageSize;
      this.paginatedGroups = this.allGroups.slice(startIndex, endIndex);
    }
  }


  volverAVentas() {
    this.router.navigate(['/venta']);
  }

}