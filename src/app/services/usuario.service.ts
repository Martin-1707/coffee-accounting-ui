import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Subject } from 'rxjs';
import { Usuario } from '../models/usuario';
import { HttpClient } from '@angular/common/http';

// 🔵 URL base de la API
const base_url = environment.base;

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  // 🔵 Endpoint de usuario
  private url = `${base_url}/usuarios`;

  // 🔵 Subject para manejar cambios en la lista de usuarios
  private listaCambio = new Subject<Usuario[]>();

  constructor(private http: HttpClient) {}

  // 🟢 Listar todos los usuarios
  list() {
    return this.http.get<Usuario[]>(this.url);
  }

  //Listar usuarios clientes
  listClientes() {
    return this.http.get<Usuario[]>(`${this.url}/clientes`);
  }

  //Listar usuarios vendedores
  listVendedores() {
    return this.http.get<Usuario[]>(`${this.url}/vendedores`);
  }

  // 🔵 Obtener un usuario por ID
  getById(id: number) {
    return this.http.get<Usuario>(`${this.url}/${id}`);
  }

  // 🟠 Registrar un nuevo usuario
  insert(usuario: Usuario) {
    return this.http.post(this.url, usuario);
  }

  // 🔵 Actualizar un usuario
  update(usuario: Usuario) {
    return this.http.put(this.url, usuario);
  }

  // 🔴 Eliminar un usuario por ID
  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }

  // 🔄 Obtener la lista actualizada de usuarios
  getList() {
    return this.listaCambio.asObservable();
  }

  // 🔄 Actualizar la lista y notificar cambios
  setList(listaNueva: Usuario[]) {
    this.listaCambio.next(listaNueva);
  }
}