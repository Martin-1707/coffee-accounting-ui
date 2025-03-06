import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { ListarcomprainsumoComponent } from "./listarcomprainsumo/listarcomprainsumo.component";

@Component({
  selector: 'app-compra-insumo',
  standalone: true,
  imports: [RouterOutlet,  ListarcomprainsumoComponent],
  templateUrl: './compra-insumo.component.html',
  styleUrl: './compra-insumo.component.css'
})
export class CompraInsumoComponent {
  constructor(public route:ActivatedRoute) {}
}
