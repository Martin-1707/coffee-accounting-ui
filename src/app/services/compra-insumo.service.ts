import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Subject } from 'rxjs';
import { CompraInsumo } from '../models/compra-insumo';
import { HttpClient } from '@angular/common/http';

const base_url = environment.base; // 🔵 URL base de la API

@Injectable({
  providedIn: 'root',
})
export class CompraInsumoService {
  // 🔵 Endpoint de compras de insumos
  private url = `${base_url}/comprasinsumos`;

  // 🔵 Subject para manejar cambios en la lista de compras de insumos
  private listaCambio = new Subject<CompraInsumo[]>();

  constructor(private http: HttpClient) {}

  // 🟢 Listar todas las compras de insumos
  list() {
    return this.http.get<CompraInsumo[]>(this.url);
  }

  // 🔵 Obtener una compra de insumo por ID
  getById(id: number) {
    return this.http.get<CompraInsumo>(`${this.url}/${id}`);
  }

  // 🟠 Registrar una nueva compra de insumo
  insert(compraInsumo: CompraInsumo) {
    return this.http.post(this.url, compraInsumo);
  }

  // 🟡 Modificar una compra de insumo existente
  update(compraInsumo: CompraInsumo) {
    return this.http.put(this.url, compraInsumo);
  }

  // 🔴 Eliminar una compra de insumo por ID
  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }

  // 🔄 Obtener la lista actualizada de compras de insumos
  getList() {
    return this.listaCambio.asObservable();
  }

  // 🔄 Actualizar la lista de compras de insumos y notificar a los componentes
  setList(listaNueva: CompraInsumo[]) {
    this.listaCambio.next(listaNueva);
  }
}
