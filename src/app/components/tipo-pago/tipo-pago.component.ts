import { Component } from '@angular/core';
import { ListartipopagoComponent } from './listartipopago/listartipopago.component';
import { ActivatedRoute, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-tipo-pago',
  standalone: true,
  imports: [RouterOutlet,ListartipopagoComponent],
  templateUrl: './tipo-pago.component.html',
  styleUrl: './tipo-pago.component.css',
})
export class TipoPagoComponent {
  constructor(public route: ActivatedRoute) {}
}
