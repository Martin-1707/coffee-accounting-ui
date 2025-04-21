import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';

interface Tile {
  title: string;
  description: string;
  color: string;
  cols: number;
  rows: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatGridListModule,
    MatCardModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  
  tiles: Tile[] = [
    { title: '📈 Ventas del Mes', description: 'S/. 10,500', cols: 2, rows: 1, color: '#FFFDE7' },
    { title: '🛒 Productos Vendidos', description: '185 unidades', cols: 1, rows: 2, color: '#E8F5E9' },
    { title: '👥 Nuevos Clientes', description: '22 registrados', cols: 1, rows: 1, color: '#E3F2FD' },
    { title: '💸 Abonos Pendientes', description: 'S/. 1,200', cols: 2, rows: 1, color: '#FFEBEE' },
  ];

  gridCols = 4;

  constructor() {
    this.updateGridCols(window.innerWidth);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.updateGridCols((event.target as Window).innerWidth);
  }

  updateGridCols(width: number) {
    if (width <= 600) {
      this.gridCols = 1;
    } else if (width <= 960) {
      this.gridCols = 2;
    } else if (width <= 1280) {
      this.gridCols = 3;
    } else {
      this.gridCols = 4;
    }
  }
}
