import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Subject } from 'rxjs';
import { EstadoVenta } from '../models/estado-venta';
import { HttpClient } from '@angular/common/http';

// 🔵 URL base de la API
const base_url = environment.base;

@Injectable({
  providedIn: 'root',
})
export class EstadoVentaService {
  // 🔵 Endpoint de estado de ventas
  private url = `${base_url}/estadoventa`;

  // 🔵 Subject para manejar cambios en la lista de estados de venta
  private listaCambio = new Subject<EstadoVenta[]>();

  constructor(private http: HttpClient) {}

  // 🟢 Listar todos los estados de venta
  list() {
    return this.http.get<EstadoVenta[]>(this.url);
  }

  // 🔵 Obtener un estado de venta por ID
  getById(id: number) {
    return this.http.get<EstadoVenta>(`${this.url}/${id}`);
  }

  // 🟠 Registrar un nuevo estado de venta
  insert(estadoVenta: EstadoVenta) {
    return this.http.post(this.url, estadoVenta);
  }

  // 🟡 Modificar un estado de venta existente
  update(estadoVenta: EstadoVenta) {
    return this.http.put(this.url, estadoVenta);
  }

  // 🔄 Obtener la lista actualizada de estados de venta
  getList() {
    return this.listaCambio.asObservable();
  }

  // 🔄 Actualizar la lista de estados de venta y notificar a los componentes
  setList(listaNueva: EstadoVenta[]) {
    this.listaCambio.next(listaNueva);
  }
}
