import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LoginService } from '../../services/login.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { JwtRequest } from '../../models/jwt-request';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    MatProgressSpinnerModule,
    MatCardModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  hide = signal(true);
  isLoading = false;

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  constructor(
    private loginService: LoginService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  username: string = '';
  password: string = '';
  mensaje: string = '';

  ngOnInit(): void { }

  login() {
    this.isLoading = true;

    let request = new JwtRequest();
    request.username = this.username;
    request.password = this.password;

    this.loginService.login(request).subscribe(
      (data: any) => {
        this.isLoading = false;
        if (data.jwttoken) {
          sessionStorage.setItem('token', data.jwttoken);
          console.log("✅ Token guardado:", data.jwttoken);
          this.router.navigate(['dashboard']);
        } else {
          console.error("❌ No se recibió un token válido del backend.");
          this.mensaje = 'Error en la autenticación';
        }
      },
      () => {
        this.isLoading = false;
        this.mensaje = 'Credenciales incorrectas';
        this.snackBar.open(this.mensaje, 'Cerrar', { duration: 2000 });
      }
    );
  }
  
  goHome() {
    this.router.navigate(['/']);
  }
  // ...
}
