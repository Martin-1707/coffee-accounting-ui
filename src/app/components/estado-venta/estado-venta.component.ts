import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { ListarestadoventaComponent } from "./listarestadoventa/listarestadoventa.component";

@Component({
  selector: 'app-estado-venta',
  standalone: true,
  imports: [RouterOutlet, ListarestadoventaComponent],
  templateUrl: './estado-venta.component.html',
  styleUrl: './estado-venta.component.css'
})
export class EstadoVentaComponent {
  constructor(public route:ActivatedRoute) {}
}
