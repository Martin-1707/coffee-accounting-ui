import { EstadoVenta } from './estado-venta';
import { Venta } from './venta';

export class HistorialEstadoVenta {
  idhistorial: number = 0;
  monto: number = 0;
  estadoVenta: EstadoVenta = new EstadoVenta();
  venta: Venta = new Venta();
  fechacambio: Date = new Date();
}
