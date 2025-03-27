import { Component, OnInit, ViewChild } from '@angular/core';
import { SidenavComponent } from '../../sidenav/sidenav.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { Rol } from '../../../models/rol';
import { RolService } from '../../../services/rol.service';

@Component({
  selector: 'app-listarrol',
  standalone: true,
  imports: [
    MatSidenavModule,
    CommonModule,
    MatTableModule,
    MatIconModule,
    RouterModule,
    MatPaginator,
  ],
  templateUrl: './listarrol.component.html',
  styleUrl: './listarrol.component.css',
})
export class ListarrolComponent implements OnInit {
  dataSource: MatTableDataSource<Rol> = new MatTableDataSource();
  displayedColumns: string[] = ['c1', 'c2', 'c3'];

  constructor(private rS: RolService, private router: Router) {}

  ngOnInit(): void {
    this.rS.list().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
    });
    this.rS.getList().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
    });
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  irACrearRol() {
    this.router.navigate(['/rol/nuevo']);
  }
}
