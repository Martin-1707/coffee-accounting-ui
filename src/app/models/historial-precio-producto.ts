import { Producto } from "./producto";
import { Usuario } from "./usuario";

export class HistorialPrecioProducto {
    idHistorialPrecio: number = 0;
    precio_anterior: number = 0;
    precio_nuevo: number = 0;
    fecha_cambio : Date = new Date();
    producto: Producto = new Producto();
    usuario: Usuario = new Usuario();
}