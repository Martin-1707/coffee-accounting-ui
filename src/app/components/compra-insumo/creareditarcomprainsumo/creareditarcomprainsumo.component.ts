import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CompraInsumoService } from '../../../services/compra-insumo.service';
import { Router } from '@angular/router';
import { CompraInsumo } from '../../../models/compra-insumo';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import * as moment from 'moment';
// Definir el formato de fecha en DD/MM/YYYY
export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-creareditarcomprainsumo',
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
  templateUrl: './creareditarcomprainsumo.component.html',
  styleUrl: './creareditarcomprainsumo.component.css',
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' }, // Establece el idioma español
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS] },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ],
})
export class CreareditarcomprainsumoComponent {
  compraInsumoForm!: FormGroup;

  constructor(private fb: FormBuilder, private ciS: CompraInsumoService, private router: Router, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.compraInsumoForm = this.fb.group({
      fecha_inicial: ['', Validators.required],
      fecha_final: ['', Validators.required],
      monto: ['', [Validators.required, Validators.min(0)]]
    });
  }
  guardarCompraInsumo() {
    if (this.compraInsumoForm.valid) {
      const nuevoProducto: CompraInsumo = this.compraInsumoForm.value;
  
      this.ciS.insert(nuevoProducto).subscribe(() => {
        this.ciS.list().subscribe((data) => {
          this.ciS.setList(data); // 🔄 Actualiza la lista para que se refleje en el listado
        });
  
        this.snackBar.open('✅ Producto registrado con éxito', 'Cerrar', {
          duration: 3000,
          verticalPosition: 'bottom',
          horizontalPosition: 'center',
        });
  
        this.router.navigate(['/compra-insumo']); // Redirigir a lista de productos
      });
    } else {
      this.compraInsumoForm.markAllAsTouched();
      this.snackBar.open('⚠️ Completa los campos correctamente', 'Cerrar', {
        duration: 3000,
        verticalPosition: 'bottom',
        horizontalPosition: 'center',
      });
    }
  }
}

