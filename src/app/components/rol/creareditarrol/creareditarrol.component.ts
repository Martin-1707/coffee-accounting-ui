import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RolService } from '../../../services/rol.service';
import { Rol } from '../../../models/rol';
import { Router } from '@angular/router';

@Component({
  selector: 'app-creareditarrol',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    ReactiveFormsModule,
    CommonModule,
    MatSnackBarModule
  ],
  templateUrl: './creareditarrol.component.html',
  styleUrl: './creareditarrol.component.css'
})
export class CreareditarrolComponent implements OnInit {
  rolForm!: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private rolService: RolService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.rolForm = this.fb.group({
      nombre_rol: ['', [Validators.required, Validators.minLength(2)]], // Obligatorio
      descripcion: [''] // Opcional
    });
  }

  guardarRol(): void {
    if (this.rolForm.valid) {
      const nuevoRol: Rol = this.rolForm.value;

      this.rolService.insert(nuevoRol).subscribe(
        () => {
          this.rolService.list().subscribe((data) => {
            this.rolService.setList(data);
          });

          this.snackBar.open('✅ Rol registrado con éxito', 'Cerrar', {
            duration: 3000,
            verticalPosition: 'bottom',
            horizontalPosition: 'center',
          });

          this.router.navigate(['/rol']);
        },
        (error) => {
          this.errorMessage = '❌ Error al registrar el rol';
          this.snackBar.open(this.errorMessage, 'Cerrar', {
            duration: 3000,
            verticalPosition: 'bottom',
            horizontalPosition: 'center',
          });
        }
      );
    } else {
      this.rolForm.markAllAsTouched();
      this.snackBar.open('⚠️ Completa los campos correctamente', 'Cerrar', {
        duration: 3000,
        verticalPosition: 'bottom',
        horizontalPosition: 'center',
      });
    }
  }
}
