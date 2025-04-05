import { Usuario } from "./usuario";

export class CompraInsumo {
  idcompra: number = 0;
  fecha_inicial: Date = new Date();
  fecha_final: Date = new Date();
  monto: number = 0;
  usuario: Usuario = new Usuario();
}
