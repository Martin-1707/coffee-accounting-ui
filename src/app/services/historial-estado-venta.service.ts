import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Subject } from 'rxjs';
import { HistorialEstadoVenta } from '../models/historial-estado-venta';
import { HttpClient } from '@angular/common/http';

// 🔵 URL base de la API
const base_url = environment.base;

@Injectable({
  providedIn: 'root'
})
export class HistorialEstadoVentaService {
  // 🔵 Endpoint de historial de estado de ventas
  private url = `${base_url}/historialventa`;

  // 🔵 Subject para manejar cambios en la lista de historial de estados de venta
  private listaCambio = new Subject<HistorialEstadoVenta[]>();

  constructor(private http: HttpClient) { }
  // 🟢 Listar todo el historial de estados de venta
  list() {
    return this.http.get<HistorialEstadoVenta[]>(this.url);
  }

  // 🔵 Obtener un historial de estado de venta por ID
  getById(id: number) {
    return this.http.get<HistorialEstadoVenta>(`${this.url}/${id}`);
  }

  // 🔄 Obtener la lista actualizada del historial de estados de venta
  getList() {
    return this.listaCambio.asObservable();
  }

  // 🔄 Actualizar la lista del historial de estados de venta y notificar a los componentes
  setList(listaNueva: HistorialEstadoVenta[]) {
    this.listaCambio.next(listaNueva);
  }
}