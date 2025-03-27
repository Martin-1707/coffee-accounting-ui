import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ProductoService } from '../../../services/producto.service';
import { Producto } from '../../../models/producto';
import { Router } from '@angular/router';
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

  constructor(private fb: FormBuilder, private productoService: ProductoService, private router: Router, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.productoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      precio_lista: ['', [Validators.required, Validators.min(0)]]
    });
  }


  registrarProducto(): void {
    if (this.productoForm.valid) {
      const nuevoProducto: Producto = this.productoForm.value;

      this.productoService.insert(nuevoProducto).subscribe(() => {
        this.productoService.list().subscribe((data) => {
          this.productoService.setList(data); // 🔄 Actualiza la lista para que se refleje en el listado
        });
  
        this.snackBar.open('✅ Producto registrado con éxito', 'Cerrar', {
          duration: 3000,
          verticalPosition: 'bottom',
          horizontalPosition: 'center',
        });

          this.router.navigate(['/producto']); // Redirigir a lista de productos
        
      });
    } else {
      this.productoForm.markAllAsTouched();
      this.snackBar.open('⚠️ Completa los campos correctamente', 'Cerrar', {
        duration: 3000,
        verticalPosition: 'bottom', // 🔽 Inferior
        horizontalPosition: 'center', // ⬅️➡️ Centrado
      });
    }
  }
}