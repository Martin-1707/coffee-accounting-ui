import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ProductoService } from '../../../services/producto.service';
import { Producto } from '../../../models/producto';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-creareditarproducto',
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
  templateUrl: './creareditarproducto.component.html',
  styleUrl: './creareditarproducto.component.css'
})
export class CreareditarproductoComponent implements OnInit {
  productoForm!: FormGroup;

  idProducto: number = 0;
  modoEdicion: boolean = false;

  constructor(private fb: FormBuilder, private productoService: ProductoService, private router: Router, private snackBar: MatSnackBar, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.productoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      precio_lista: ['', [Validators.required, Validators.min(0)]]
    });
  
    this.route.params.subscribe(params => {
      this.idProducto = params['id'];
      this.modoEdicion = !!this.idProducto;
  
      if (this.modoEdicion) {
        this.productoService.getById(this.idProducto).subscribe(data => {
          this.productoForm.patchValue({
            nombre: data.nombre,
            precio_lista: data.precio_lista
          });
        });
      }
    });
  }

  guardarProducto(): void {
    if (this.productoForm.valid) {
      const producto: Producto = this.productoForm.value;
  
      if (this.modoEdicion) {
        producto.idproducto = this.idProducto;
      
        console.log('🟡 Enviando a actualizarPrecioProducto:', {
          idProducto: this.idProducto,
          nuevoPrecio: Number(producto.precio_lista)
        });
      
        this.productoService.actualizarPrecioProducto(
          this.idProducto,
          Number(producto.precio_lista)
        ).subscribe(() => {
          this.snackBar.open('✏️ Producto actualizado con éxito', 'Cerrar', {
            duration: 3000,
          });
          this.router.navigate(['/producto']);
        });
      }
       else {
        // ✅ Crear nuevo producto
        this.productoService.insert(producto).subscribe(() => {
          this.snackBar.open('✅ Producto registrado con éxito', 'Cerrar', {
            duration: 3000,
            verticalPosition: 'bottom',
            horizontalPosition: 'center',
          });
          this.router.navigate(['/producto']);
        });
      }
    } else {
      this.productoForm.markAllAsTouched();
      this.snackBar.open('⚠️ Completa los campos correctamente', 'Cerrar', {
        duration: 3000,
        verticalPosition: 'bottom',
        horizontalPosition: 'center',
      });
    }
  }
}