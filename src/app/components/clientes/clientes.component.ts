import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { ListarclientesComponent } from './listarclientes/listarclientes.component';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [RouterOutlet, ListarclientesComponent],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.css'
})
export class ClientesComponent {
  constructor(public route:ActivatedRoute) {}
}
