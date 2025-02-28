import { TipoPago } from './tipo-pago';
import { Venta } from './venta';

export class Abono {
  idabono: number = 0;
  monto: number = 0;
  fecha_abono: Date = new Date();
  venta: Venta = new Venta();
  tipoPago: TipoPago = new TipoPago();
}
