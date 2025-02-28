import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Subject } from 'rxjs';
import { Venta } from '../models/venta';
import { HttpClient, HttpParams } from '@angular/common/http';

// 🔵 URL base de la API
const base_url = environment.base;
@Injectable({
  providedIn: 'root'
})
export class VentaService {
 // 🔵 Endpoint de ventas
 private url = `${base_url}/ventas`;

 // 🔵 Subject para manejar cambios en la lista de ventas
 private listaCambio = new Subject<Venta[]>();

 constructor(private http: HttpClient) {}

 // 🟢 Listar todas las ventas
 list() {
  return this.http.get<Venta[]>(this.url);
}

// 🔵 Obtener una venta por ID
getById(id: number) {
  return this.http.get<Venta>(`${this.url}/${id}`);
}

// 🟠 Registrar una nueva venta
registrarVenta(ventaData: any) {
  return this.http.post(`${this.url}/registrar`, ventaData);
}

// 🔄 Obtener la lista actualizada de ventas
getList() {
  return this.listaCambio.asObservable();
}

// 🔄 Actualizar la lista y notificar cambios
setList(listaNueva: Venta[]) {
  this.listaCambio.next(listaNueva);
}

}
