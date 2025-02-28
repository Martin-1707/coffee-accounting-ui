import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtRequest } from '../models/jwt-request';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LoginService {

  constructor(private http: HttpClient, private router: Router) {}

  // 🔑 Iniciar sesión
  login(request: JwtRequest) {
    return this.http.post<{ token: string }>(`${environment.base}/login`, request);
  }
  
  
  
  
  // 🔍 Verificar si el usuario está autenticado
  verificar() {
    let token = sessionStorage.getItem('token');
    return token != null;
  }

  // 🔐 Cerrar sesión con verificación del token
logout() {
  const token = sessionStorage.getItem('token');
  const jwtHelper = new JwtHelperService();
  
  if (token) {
    console.log('Token expirado:', jwtHelper.isTokenExpired(token));
  }
  
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('currentUser');
  this.router.navigate(['/login']);
}

showRole() {
  let token = sessionStorage.getItem('token');
  
  if (!token) {
    console.error("⚠️ No hay token en sessionStorage");
    return null; 
  }

  try {
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(token);
    console.log("✅ Token decodificado:", decodedToken); // <-- Esto te ayuda a verificar si el token es correcto
    return decodedToken?.role || 'Sin rol';
  } catch (error) {
    console.error("❌ Error al decodificar el token:", error);
    return null;
  }
}

  // 👤 Obtener el usuario autenticado
  
  showUser() {
    let token = sessionStorage.getItem('token');
    if (!token) {
      // Manejar el caso en el que el token es nulo.
      return null; // O cualquier otro valor predeterminado dependiendo del contexto.
    }
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(token);
    console.log(decodedToken)
    return decodedToken?.sub;
  }

  // 🔄 Obtener el usuario actual guardado en sessionStorage
  getCurrentUser() {
    const user = sessionStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }

  // 📛 Obtener nombre y apellido del usuario autenticado
  getNombre(): string {
    const user = this.getCurrentUser();
    return user ? user.nombre : 'Nombre';
  }

  getApellido(): string {
    const user = this.getCurrentUser();
    return user ? user.apellido : 'Apellido';
  }
}
