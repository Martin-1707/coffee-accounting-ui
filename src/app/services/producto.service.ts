import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, Subject } from 'rxjs';
import { Producto } from '../models/producto';
import { HttpClient } from '@angular/common/http';

// 🔵 URL base de la API
const base_url = environment.base;

@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  // 🔵 Endpoint de productos
  private url = `${base_url}/productos`;

  // 🔵 Subject para manejar cambios en la lista de productos
  private listaCambio = new Subject<Producto[]>();

  constructor(private http: HttpClient) {}

  // 🟢 Listar todos los productos
  list() {
    return this.http.get<Producto[]>(this.url);
  }

  // 🔵 Obtener un producto por ID
  getById(id: number) {
    return this.http.get<Producto>(`${this.url}/${id}`);
  }

  // 🟠 Registrar un nuevo producto
  insert(producto: Producto) {
    return this.http.post(this.url, producto);
  }

  // 🔵 Actualizar un producto
  actualizarPrecioProducto(idProducto: number, nuevoPrecio: number): Observable<any> {
    return this.http.put(`${this.url}/actualizarPrecio`, {
      idProducto,
      nuevoPrecio
    }, { responseType: 'text' }); // 👈 esto es clave
  }
  

  // 🔄 Obtener la lista actualizada de productos
  getList() {
    return this.listaCambio.asObservable();
  }

  // 🔄 Actualizar la lista de productos y notificar a los componentes
  setList(listaNueva: Producto[]) {
    this.listaCambio.next(listaNueva);
  }
}