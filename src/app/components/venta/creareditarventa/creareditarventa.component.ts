import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { VentaService } from '../../../services/venta.service';
import { Router } from '@angular/router';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-creareditarventa',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    ReactiveFormsModule,
    CommonModule,
    MatSnackBarModule,
    MatCheckboxModule
  ],
  templateUrl: './creareditarventa.component.html',
  styleUrl: './creareditarventa.component.css'
})
export class CreareditarventaComponent implements OnInit{
  ventaForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private ventaService: VentaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.ventaForm = this.fb.group({
      clienteId: ['', Validators.required],
      vendedorId: ['', Validators.required],
      factura: [false],
      especificarProducto: [false],
      productos: this.fb.array([]),
      montoManual: [{ value: '', disabled: false }, Validators.required],
      abono: ['', Validators.required],
      tipoPagoId: [{ value: '', disabled: true }, Validators.required] // Inicialmente deshabilitado
    });

    // Escuchar cambios en "abono" y habilitar/deshabilitar "tipoPagoId"
    this.ventaForm.get('abono')!.valueChanges.subscribe(value => {
      if (value && Number(value) > 0) {
        this.ventaForm.get('tipoPagoId')!.enable();
      } else {
        this.ventaForm.get('tipoPagoId')!.disable();
        this.ventaForm.get('tipoPagoId')!.setValue(''); // Resetea si se deshabilita
      }
    });

    this.ventaForm.get('especificarProducto')!.valueChanges.subscribe(value => {
      if (value) {
        this.ventaForm.get('montoManual')!.disable();
        this.addProducto();
      } else {
        this.ventaForm.get('montoManual')!.enable();
        this.clearProductos();
      }
    });
  }

  get productos(): FormArray {
    return this.ventaForm.get('productos') as FormArray;
  }

  addProducto(): void {
    this.productos.push(this.fb.group({
      producto: ['', Validators.required],
      cantidad: ['', [Validators.required, Validators.min(1)]]
    }));
  }

  removeProducto(index: number): void {
    this.productos.removeAt(index);
  }

  clearProductos(): void {
    this.ventaForm.setControl('productos', this.fb.array([]));
  }

  guardarVenta(): void {
    if (this.ventaForm.invalid) {
      this.ventaForm.markAllAsTouched();
      this.mostrarMensaje('⚠️ Completa los campos correctamente');
      return;
    }

    const formData = this.ventaForm.value;
    console.log('📤 Datos enviados:', formData);

    if (formData.especificarProducto) {
      const ventaData = {
        clienteId: Number(formData.clienteId),
        vendedorId: Number(formData.vendedorId),
        factura: formData.factura,
        abono: Number(formData.abono),
        productos: formData.productos.map((p: any) => ({
          id: Number(p.producto),
          cantidad: Number(p.cantidad)
        })),
        tipoPagoId: Number(formData.tipoPagoId)
      };

      console.log('🛒 Venta con productos:', ventaData);

      this.ventaService.registrarVenta(ventaData).subscribe({
        next: () => this.postRegistro('✅ Venta con productos registrada con éxito'),
        error: (err) => {
          console.error('❌ Error en la API:', err);
          this.mostrarMensaje('❌ Error: ' + (err.error?.message || 'Solicitud inválida'));
        }
      });
    } else {
      const ventaSimpleData = {
        clienteId: Number(formData.clienteId),
        vendedorId: Number(formData.vendedorId),
        factura: formData.factura,
        montoManual: Number(formData.montoManual),
        abono: Number(formData.abono),
        tipoPagoId: Number(formData.tipoPagoId)
      };

      console.log('📦 Venta simple sin productos:', ventaSimpleData);

      this.ventaService.registrarVentaSimple(ventaSimpleData).subscribe({
        next: () => this.postRegistro('✅ Venta simple registrada con éxito'),
        error: (err) => {
          console.error('❌ Error en la API:', err);
          this.mostrarMensaje('❌ Error: ' + (err.error?.message || 'Solicitud inválida'));
        }
      });
    }
  }
  
  postRegistro(mensaje: string) {
    this.ventaService.list().subscribe((data) => {
      this.ventaService.setList(data);
    });

    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000,
      verticalPosition: 'bottom',
      horizontalPosition: 'center'
    });

    this.router.navigate(['/venta']);
  }

  mostrarMensaje(mensaje: string) {
    this.snackBar.open(mensaje, 'Cerrar', { duration: 3000 });
  }
}