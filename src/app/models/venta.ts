import { Usuario } from './usuario';

export class Venta {
  idventa: number = 0;
  fechaventa: Date = new Date();
  monto: number = 0;
  usuarioCliente: Usuario = new Usuario();
  usuarioVendedor: Usuario = new Usuario();
  factura: boolean = true;
  saldopendiente: number = 0;
}
