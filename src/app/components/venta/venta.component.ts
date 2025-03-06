import { Component } from '@angular/core';
import { ListarventaComponent } from './listarventa/listarventa.component';
import { ActivatedRoute, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-venta',
  standalone: true,
  imports: [RouterOutlet,ListarventaComponent],
  templateUrl: './venta.component.html',
  styleUrl: './venta.component.css',
})
export class VentaComponent {
  constructor(public route: ActivatedRoute) {}
}
