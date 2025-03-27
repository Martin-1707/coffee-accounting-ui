import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AbonoService } from '../../../services/abono.service';

@Component({
  selector: 'app-crearabono',
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
  templateUrl: './crearabono.component.html',
  styleUrl: './crearabono.component.css'
})
export class CrearabonoComponent {
  abonoForm!: FormGroup;

  tiposPago = [
    { id: 1, nombre: 'Efectivo' },
    { id: 2, nombre: 'Tarjeta' },
    { id: 3, nombre: 'Transferencia' }
  ];

  constructor(
    private fb: FormBuilder,
    private abonoService: AbonoService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.abonoForm = this.fb.group({
      ventaId: [null, [Validators.required, Validators.min(1)]],
      abono: [null, [Validators.required, Validators.min(1)]],
      tipoPagoId: [null, Validators.required]
    });
  }

  registrarAbono() {
    if (this.abonoForm.valid) {
      const abonoData = {
        ventaId: Number(this.abonoForm.value.ventaId),
        abono: Number(this.abonoForm.value.abono),
        tipoPagoId: Number(this.abonoForm.value.tipoPagoId)
      };
      
      this.abonoService.registerAbono(abonoData).subscribe({
        next: () => {
          this.snackBar.open('✅ Abono registrado con éxito', 'Cerrar', { duration: 3000 });
          this.abonoForm.reset();
          this.router.navigate(['/abono']); // 🔹 Redirige a la lista de abonos
        },
        error: (err) => {
          console.error('❌ Error al registrar abono:', err);
          this.snackBar.open('❌ Error al registrar el abono', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }
}