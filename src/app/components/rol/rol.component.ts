import { Component } from '@angular/core';
import { ListarrolComponent } from "./listarrol/listarrol.component";
import { ActivatedRoute, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-rol',
  standalone: true,
  imports: [RouterOutlet,ListarrolComponent],
  templateUrl: './rol.component.html',
  styleUrl: './rol.component.css'
})
export class RolComponent {
 constructor(public route: ActivatedRoute) {}
}
