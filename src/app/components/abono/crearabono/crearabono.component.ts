import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AbonoService } from '../../../services/abono.service';
import { VentaService } from '../../../services/venta.service';
import { TipoPagoService } from '../../../services/tipo-pago.service';

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
    MatSelectModule
  ],
  templateUrl: './crearabono.component.html',
  styleUrl: './crearabono.component.css'
})
export class CrearabonoComponent implements OnInit {
  abonoForm!: FormGroup;
  ventas: any[] = [];
  tiposPago: any[] = [];

  constructor(
    private fb: FormBuilder,
    private abonoService: AbonoService,
    private ventaService: VentaService,
    private tipoPagoService: TipoPagoService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.abonoForm = this.fb.group({
      ventaId: [null, [Validators.required]],
      abono: [null, [Validators.required, Validators.min(1)]],
      tipoPagoId: [null, Validators.required]
    });

    // Cargar ventas y filtrar solo las que tienen saldo pendiente distinto de 0
    this.ventaService.list().subscribe({
      next: (data) => {
        this.ventas = data.filter((venta: any) => Number(venta.saldopendiente) > 0);
      },
      error: () => this.snackBar.open('Error al cargar ventas', 'Cerrar', { duration: 3000 })
    });

    // Cargar tipos de pago
    this.tipoPagoService.list().subscribe({
      next: (data) => this.tiposPago = data,
      error: () => this.snackBar.open('Error al cargar tipos de pago', 'Cerrar', { duration: 3000 })
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
          this.router.navigate(['/abono']);
        },
        error: (err) => {
          console.error('❌ Error al registrar abono:', err);
          this.snackBar.open('❌ Error al registrar el abono', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }
}