import { Component } from '@angular/core';
import { ListarventasproductoComponent } from './listarventasproducto/listarventasproducto.component';
import { ActivatedRoute, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-ventas-producto',
  standalone: true,
  imports: [RouterOutlet,ListarventasproductoComponent],
  templateUrl: './ventas-producto.component.html',
  styleUrl: './ventas-producto.component.css',
})
export class VentasProductoComponent {
  constructor(public route: ActivatedRoute) {}
}
