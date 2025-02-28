import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../navbar/navbar.component';

@Component({
  selector: 'app-nosotros',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './nosotros.component.html',
  styleUrl: './nosotros.component.css',
})
export class NosotrosComponent {}
