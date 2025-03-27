import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { EstadoVentaService } from '../../../services/estado-venta.service';
import { Router } from '@angular/router';
import { EstadoVenta } from '../../../models/estado-venta';

@Component({
  selector: 'app-creareditarestadoventa',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    ReactiveFormsModule,
    CommonModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './creareditarestadoventa.component.html',
  styleUrl: './creareditarestadoventa.component.css'
})
export class CreareditarestadoventaComponent implements OnInit {
  estadoVentaForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private estadoVentaService: EstadoVentaService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.estadoVentaForm = this.fb.group({
      nombreestado: ['', [
        Validators.required,
        Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/) // Solo letras y espacios
      ]]
    });
  }

  guardarEstadoVenta(): void {
    if (this.estadoVentaForm.valid) {
      const nuevoEstado : EstadoVenta = this.estadoVentaForm.value;

      this.estadoVentaService.insert(nuevoEstado).subscribe(() => {
        this.estadoVentaService.list().subscribe((data) => {
          this.estadoVentaService.setList(data); // 🔄 Actualiza la lista para que se refleje en el listado
        });

        this.snackBar.open('✅ Estado de venta registrado con éxito', 'Cerrar', {
          duration: 3000,
          verticalPosition: 'bottom',
          horizontalPosition: 'center',
        });

        this.router.navigate(['/estado-venta']); // Redirigir al listado
      });
    } else {
      this.estadoVentaForm.markAllAsTouched();
      this.snackBar.open('⚠️ Ingresa un nombre válido (solo letras y espacios)', 'Cerrar', {
        duration: 3000,
        verticalPosition: 'bottom',
        horizontalPosition: 'center',
      });
    }
  }
}