import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TipoPagoService } from '../../../services/tipo-pago.service';
import { Router } from '@angular/router';
import { TipoPago } from '../../../models/tipo-pago';

@Component({
  selector: 'app-creareditartipopago',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    ReactiveFormsModule,
    CommonModule,
    MatSnackBarModule,
  ],
  templateUrl: './creareditartipopago.component.html',
  styleUrl: './creareditartipopago.component.css'
})
export class CreareditartipopagoComponent {
  tipoPagoForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private tipoPagoService: TipoPagoService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.tipoPagoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      descripcion: ['', [Validators.required]]
    });
  }

  guardarTipoPago(): void {
    if (this.tipoPagoForm.valid) {
      const nuevoTipoPago: TipoPago = this.tipoPagoForm.value;

      this.tipoPagoService.insert(nuevoTipoPago).subscribe(() => {
        this.tipoPagoService.list().subscribe((data) => {
          this.tipoPagoService.setList(data);
        });

        this.snackBar.open('✅ Tipo de pago registrado con éxito', 'Cerrar', {
          duration: 3000,
          verticalPosition: 'bottom',
          horizontalPosition: 'center',
        });

        this.router.navigate(['/tipo-pago']);
      });
    } else {
      this.tipoPagoForm.markAllAsTouched();
      this.snackBar.open('⚠️ Completa los campos correctamente', 'Cerrar', {
        duration: 3000,
        verticalPosition: 'bottom',
        horizontalPosition: 'center',
      });
    }
  }
}