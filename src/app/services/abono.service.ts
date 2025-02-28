import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Abono } from '../models/abono';
import { Subject } from 'rxjs';

// 🔵 URL base de la API
const base_url = environment.base;

@Injectable({
  providedIn: 'root',
})
export class AbonoService {
  // 🔵 Endpoint de abonos
  private url = `${base_url}/abonos`;

  // 🔵 Subject para manejar cambios en la lista de abonos
  private listaCambio = new Subject<Abono[]>();

  constructor(private http: HttpClient) {}

  // 🟢 Listar todos los abonos
  list() {
    return this.http.get<Abono[]>(this.url);
  }

  // 🔵 Obtener un abono por ID
  getById(id: number) {
    return this.http.get<Abono>(`${this.url}/${id}`);
  }

  // 🟠 Registrar un nuevo abono
  registerAbono(ventaId: number, abono: number, tipoPagoId: number) {
    return this.http.post(`${this.url}/registrarAbono`, null, {
      params: {
        ventaId: ventaId.toString(), // 🔹 Convertimos los valores a string para pasarlos como parámetros en la URL
        abono: abono.toString(),
        tipoPagoId: tipoPagoId.toString()
      }
    });
  }


  //get y set
  // 🔄 Obtener la lista actualizada de abonos
  getList() {
    return this.listaCambio.asObservable();
  }

  // 🔄 Actualizar la lista de abonos y notificar a los componentes
  setList(listaNueva: Abono[]) {
    this.listaCambio.next(listaNueva);
  }
}
