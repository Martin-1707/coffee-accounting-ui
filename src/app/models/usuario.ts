import { Rol } from './rol';

export class Usuario {
  idusuario: number = 0;
  nombre: string = '';
  apellido: string = '';
  email: string = '';
  username: string = '';
  password: string = '';
  fecha_creacion: Date = new Date(Date.now());
  enabled: boolean = true;
  rol: Rol = new Rol();
  subordinados?: Usuario[];
  usuarioPadre?: Usuario;
}
