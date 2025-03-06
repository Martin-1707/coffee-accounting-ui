import { Component } from '@angular/core';
import { ListarusuarioComponent } from './listarusuario/listarusuario.component';
import { ActivatedRoute, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [RouterOutlet, ListarusuarioComponent],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.css',
})
export class UsuarioComponent {
  constructor(public route: ActivatedRoute) {}
}
