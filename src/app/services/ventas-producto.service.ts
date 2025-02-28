import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { VentasProducto } from '../models/ventas-producto';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

// 🔵 URL base de la API
const base_url = environment.base;

@Injectable({
  providedIn: 'root',
})
export class VentasProductoService {
  // 🔵 Endpoint de ventas-producto
  private url = `${base_url}/ventaproducto`;

  // 🔄 Subject para manejar cambios en la lista de ventas-producto
  private listaCambio = new Subject<VentasProducto[]>();

  constructor(private http: HttpClient) {}

  // 🟢 Listar todos los productos en ventas
  list() {
    return this.http.get<VentasProducto[]>(this.url);
  }

  // 🔵 Obtener un producto de una venta por su ID
  getById(id: number) {
    return this.http.get<VentasProducto>(`${this.url}/${id}`);
  }

  // 🔄 Obtener la lista actualizada de ventas-producto
  getList(){
    return this.listaCambio.asObservable();
  }

  // 🔄 Actualizar la lista y notificar cambios
  setList(listaNueva: VentasProducto[]) {
    this.listaCambio.next(listaNueva);
  }
}
