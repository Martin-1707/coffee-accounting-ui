import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Subject } from 'rxjs';
import { TipoPago } from '../models/tipo-pago';
import { HttpClient } from '@angular/common/http';


// 🔵 URL base de la API
const base_url = environment.base;

@Injectable({
  providedIn: 'root',
})
export class TipoPagoService {
  // 🔵 Endpoint de tipo de pago
  private url = `${base_url}/tipopago`;

  // 🔵 Subject para manejar cambios en la lista de tipos de pago
  private listaCambio = new Subject<TipoPago[]>();

  constructor(private http: HttpClient) {}

  // 🟢 Listar todos los tipos de pago
  list() {
    return this.http.get<TipoPago[]>(this.url);
  }

  // 🔵 Obtener un tipo de pago por ID
  getById(id: number) {
    return this.http.get<TipoPago>(`${this.url}/${id}`);
  }

  // 🟠 Registrar un nuevo tipo de pago
  insert(tipoPago: TipoPago) {
    return this.http.post(this.url, tipoPago);
  }

  // 🔵 Actualizar un tipo de pago
  update(tipoPago: TipoPago) {
    return this.http.put(this.url, tipoPago);
  }

  // 🔴 Eliminar un tipo de pago por ID
  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }

  // 🔄 Obtener la lista actualizada de tipos de pago
  getList() {
    return this.listaCambio.asObservable();
  }

  // 🔄 Actualizar la lista y notificar cambios
  setList(listaNueva: TipoPago[]) {
    this.listaCambio.next(listaNueva);
  }
}