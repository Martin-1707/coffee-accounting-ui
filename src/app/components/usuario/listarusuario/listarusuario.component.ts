import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { Usuario } from '../../../models/usuario';
import { UsuarioService } from '../../../services/usuario.service';
import { MatCardModule } from '@angular/material/card';
import { LoginService } from '../../../services/login.service';
import { MatTreeModule, MatTreeNestedDataSource } from '@angular/material/tree';
import { NestedTreeControl } from '@angular/cdk/tree';

@Component({
  selector: 'app-listarusuario',
  standalone: true,
  imports: [
    MatSidenavModule,
    CommonModule,
    MatTableModule,
    MatIconModule,
    RouterModule,
    MatCardModule,
    MatTreeModule
  ],
  templateUrl: './listarusuario.component.html',
  styleUrl: './listarusuario.component.css',
})
export class ListarusuarioComponent implements OnInit {
  // ── Pestaña de tabla (la mantengo, pero la ocultaremos) ──────────────────────────
  dataSource: MatTableDataSource<Usuario> = new MatTableDataSource();
  displayedColumns: string[] = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // ── Datos del usuario autenticado y jerarquía ─────────────────────────────────
  usuarioLogeado: Usuario | null = null;
  supervisador: Usuario | null = null;
  hijos: Usuario[] = [];
  descendientes: Usuario[] = [];

  // ── Configuración del árbol ───────────────────────────────────────────────────
  treeControl = new NestedTreeControl<Usuario>(node => node.subordinados!);
  treeDataSource = new MatTreeNestedDataSource<Usuario>();

  // Determina si un nodo tiene hijos:
  hasChild = (_: number, node: Usuario) => !!node.subordinados && node.subordinados.length > 0;


  constructor(private uS: UsuarioService, private lS: LoginService) { }

  ngOnInit(): void {
    // Obtener la jerarquía del usuario logeado
    this.uS.getJerarquia().subscribe({
      next: (rootUser: Usuario) => {
        this.usuarioLogeado = rootUser;
        this.hijos = rootUser.subordinados || [];
        this.descendientes = this.getDescendientesPlanos(rootUser);
        this.treeDataSource.data = rootUser.subordinados || [];
        console.log('Jerarquía recibida:', JSON.stringify(rootUser, null, 2));
      },
      error: err => {
        console.error('Error al obtener jerarquía:', err);
      }
    });

    // Obtener información del usuario actual
    this.uS.getCurrentUser().subscribe({
      next: (currentUser: Usuario) => {
        this.usuarioLogeado = currentUser;
        console.log('Usuario logeado:', JSON.stringify(currentUser, null, 2));
      },
      error: err => {
        console.error('Error al obtener información del usuario actual:', err);
      }
    });
    // Obtener información del superior del usuario actual
    this.uS.getSuperior().subscribe({
      next: (currentUser: Usuario) => {
        this.supervisador = currentUser;
        console.log('Superior:', JSON.stringify(currentUser, null, 2));
      },
      error: err => {
        console.error('Error al obtener información del Superior:', err);
      }
    });
  }

  ngAfterViewInit() {
    // paginador de la tabla (aunque vamos a ocultar la tabla en el HTML)
    this.dataSource.paginator = this.paginator;
  }

  /** Si deseas calcular todos los descendientes de forma “plana” */
  private getDescendientesPlanos(root: Usuario): Usuario[] {
    const lista: Usuario[] = [];
    function recorrer(u: Usuario) {
      if (!u.subordinados) return;
      for (const hijo of u.subordinados) {
        lista.push(hijo);
        recorrer(hijo);
      }
    }
    recorrer(root);
    return lista;
  }
}