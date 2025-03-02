import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { RouterModule } from '@angular/router';
import { SidenavComponent } from '../../sidenav/sidenav.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-listarabono',
  standalone: true,
  imports: [
    MatTableModule, 
    MatIconModule, 
    RouterModule,
    MatSidenavModule,
    CommonModule
  ],
  templateUrl: './listarabono.component.html',
  styleUrl: './listarabono.component.css'
})
export class ListarabonoComponent {

}
