import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Subject } from 'rxjs';
import { HistorialPrecioProducto } from '../models/historial-precio-producto';
import { HttpClient } from '@angular/common/http';

// 🔵 URL base de la API
const base_url = environment.base;

@Injectable({
  providedIn: 'root'
})
export class HistorialPrecioProductoService {

  private url = `${base_url}/historialprecioproducto`;

  private listaCambio = new Subject<HistorialPrecioProducto[]>();

  constructor(private http: HttpClient) { }

  list() {
    return this.http.get<HistorialPrecioProducto[]>(this.url);
  }

  // 🔵 Obtener un historial de estado de venta por ID
  getById(id: number) {
    return this.http.get<HistorialPrecioProducto>(`${this.url}/${id}`);
  }

  // 🔄 Obtener la lista actualizada del historial de estados de venta
  getList() {
    return this.listaCambio.asObservable();
  }

  // 🔄 Actualizar la lista del historial de estados de venta y notificar a los componentes
  setList(listaNueva: HistorialPrecioProducto[]) {
    this.listaCambio.next(listaNueva);
  }
}
