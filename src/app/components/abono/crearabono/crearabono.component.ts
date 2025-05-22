import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
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
  ],
  templateUrl: './crearabono.component.html',
  styleUrl: './crearabono.component.css'
})
export class CrearabonoComponent implements OnInit {
  abonoForm!: FormGroup;
  ventas: any[] = [];
  tiposPago: any[] = [];

  private paramVentaId?: number;

  constructor(
    private fb: FormBuilder,
    private abonoService: AbonoService,
    private ventaService: VentaService,
    private tipoPagoService: TipoPagoService,
    private router: Router,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.abonoForm = this.fb.group({
      ventaId: [null, [Validators.required]],
      abono: [null, [Validators.required, Validators.min(1)]],
      tipoPagoId: [null, Validators.required]
    });

    // 1) Capturar queryParam idVenta si viene
    this.route.queryParams.subscribe(params => {
      if (params['idVenta']) {
        this.paramVentaId = +params['idVenta'];
      }
    });

    // 2) Cargar ventas y preseleccionar + deshabilitar
    this.ventaService.list().subscribe({
      next: (data) => {
        this.ventas = data.filter((v: any) => Number(v.saldopendiente) > 0);

        if (this.paramVentaId) {
          const existe = this.ventas.some(v => v.idventa === this.paramVentaId);
          if (existe) {
            const ctrl = this.abonoForm.get('ventaId')!;
            ctrl.setValue(this.paramVentaId);
            ctrl.disable();        // ← Aquí deshabilitas el select
          }
        }
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
        ventaId: Number(this.abonoForm.getRawValue().ventaId),
        abono: Number(this.abonoForm.value.abono),
        tipoPagoId: Number(this.abonoForm.value.tipoPagoId)
      };

      this.abonoService.registerAbono(abonoData).subscribe({
        next: () => {
          this.snackBar.open('✅ Abono registrado con éxito', 'Cerrar', { duration: 3000 });
          this.abonoForm.reset();

          if (this.paramVentaId) {
            // Si vino con idVenta desde afuera, redirige a esa venta específica
            this.router.navigate(['/abonos/venta', this.paramVentaId]);
          } else {
            // Si no, redirige al listado general
            this.router.navigate(['/abonos']);
          }
        },
        error: (err) => {
          console.error('❌ Error al registrar abono:', err);
          this.snackBar.open('❌ Error al registrar el abono', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }

}