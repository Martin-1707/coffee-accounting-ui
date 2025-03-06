import { Component } from '@angular/core';
import { ListarhistorialestadoventaComponent } from "./listarhistorialestadoventa/listarhistorialestadoventa.component";
import { ActivatedRoute, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-historial-estado-venta',
  standalone: true,
  imports: [RouterOutlet, ListarhistorialestadoventaComponent],
  templateUrl: './historial-estado-venta.component.html',
  styleUrl: './historial-estado-venta.component.css'
})
export class HistorialEstadoVentaComponent {
  constructor(public route:ActivatedRoute) {}
}
