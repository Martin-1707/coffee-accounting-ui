import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { ListarabonoComponent } from './listarabono/listarabono.component';

@Component({
  selector: 'app-abono',
  standalone: true,
  imports: [RouterOutlet, ListarabonoComponent],
  templateUrl: './abono.component.html',
  styleUrl: './abono.component.css'
})
export class AbonoComponent {
  constructor(public route:ActivatedRoute) {}
}
