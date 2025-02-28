import { Producto } from './producto';
import { Venta } from './venta';

export class VentasProducto {
  idventaproducto: number = 0;
  venta: Venta = new Venta();
  producto: Producto = new Producto();
  cantidad: number = 0;
  precio: number = 0;
}
