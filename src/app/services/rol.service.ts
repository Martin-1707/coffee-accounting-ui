import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Subject } from 'rxjs';
import { Rol } from '../models/rol';
import { HttpClient } from '@angular/common/http';

// 🔵 URL base de la API
const base_url = environment.base;

@Injectable({
  providedIn: 'root'
})
export class RolService {
// 🔵 Endpoint de roles
private url = `${base_url}/roles`;

// 🔄 Subject para manejar cambios en la lista de roles
private listaCambio = new Subject<Rol[]>();

constructor(private http: HttpClient) {}

// 🟢 Listar todos los roles
list() {
  return this.http.get<Rol[]>(this.url);
}

// 🔵 Obtener un rol por ID
getById(id: number) {
  return this.http.get<Rol>(`${this.url}/${id}`);
}

// 🟠 Insertar un nuevo rol
insert(rol: Rol) {
  return this.http.post(this.url, rol);
}

// 🔵 Actualizar un rol
update(rol: Rol) {
  return this.http.put(this.url, rol);
}

// 🔴 Eliminar un rol por ID
delete(id: number) {
  return this.http.delete(`${this.url}/${id}`);
}

// 🔄 Obtener la lista actualizada de roles
getList() {
  return this.listaCambio.asObservable();
}

// 🔄 Actualizar la lista y notificar cambios
setList(listaNueva: Rol[]) {
  this.listaCambio.next(listaNueva);
}
}
