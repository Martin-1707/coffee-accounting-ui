import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { ListarHistorialPrecioProductoComponent } from './listar-historial-precio-producto/listar-historial-precio-producto.component';

@Component({
  selector: 'app-historial-precio-producto',
  standalone: true,
  imports: [RouterOutlet, ListarHistorialPrecioProductoComponent],
  templateUrl: './historial-precio-producto.component.html',
  styleUrl: './historial-precio-producto.component.css'
})
export class HistorialPrecioProductoComponent {
  constructor(public route:ActivatedRoute) {}
}
