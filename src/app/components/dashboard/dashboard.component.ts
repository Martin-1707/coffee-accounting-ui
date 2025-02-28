import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, SidenavComponent,MatSidenavModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  isExpanded: boolean = true; // Se mantiene abierto por defecto
}

