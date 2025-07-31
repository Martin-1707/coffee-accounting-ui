import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CompraInsumoService } from '../../../services/compra-insumo.service';
import { Router } from '@angular/router';
import { CompraInsumo } from '../../../models/compra-insumo';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { UsuarioService } from '../../../services/usuario.service';
import { MatIconModule } from '@angular/material/icon';
import { LoginService } from '../../../services/login.service';

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
    MatIconModule
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
  esVendedor: boolean = false; // Variable para controlar la edición del campo
  usuario: any = null; // 🔹 Nueva variable para almacenar el usuario autenticado
  listaUsuarios: any[] = []; // 🔹 Nueva variable para almacenar la lista de usuarios
  hoy: Date = new Date(); // Esto te da la fecha actual

  constructor(
    private fb: FormBuilder,
    private ciS: CompraInsumoService,
    private uS: UsuarioService,
    private router: Router,
    private snackBar: MatSnackBar,
    private loginservice: LoginService // Inyectar el servicio de login
  ) { }

  ngOnInit(): void {
    this.compraInsumoForm = this.fb.group({
      fecha_inicial: ['', [Validators.required, this.noFechaFuturaValidator.bind(this)]],
      fecha_final: ['', [Validators.required, this.noFechaFuturaValidator.bind(this)]],
      monto: ['', [Validators.required, Validators.min(0)]],
      idusuario: ['', Validators.required]
    });

    const username = this.loginservice.showUser(); // "martin"
    const rol = this.loginservice.showRole(); // "Administrador"

    if (username && rol) {
      this.uS.list().subscribe((usuarios) => {
        console.log('👉 usuarios:', usuarios);
        console.log('🔍 username token:', username);
        const usuarioEncontrado = usuarios.find(u => u.username === username);

        if (usuarioEncontrado) {
          this.usuario = usuarioEncontrado;
          this.esVendedor = usuarioEncontrado.rol.nombre_rol === 'Vendedor';

          if (rol === 'Administrador' || rol === 'Supervisor') {
            this.listaUsuarios = usuarios.filter(
              (u) => u.rol.nombre_rol === 'Vendedor'
            );
            this.compraInsumoForm.get('idusuario')?.enable();
          } else {
            this.listaUsuarios = [usuarioEncontrado];
            this.compraInsumoForm.get('idusuario')?.disable();
            this.compraInsumoForm.patchValue({
              idusuario: usuarioEncontrado.idusuario,
            });
            console.log(
              'Usuario seteado:',
              this.compraInsumoForm.get('idusuario')?.value
            );
            this.compraInsumoForm.get('idusuario')?.disable(); // Deshabilitar el campo si no es administrador
          }
        } else {
          console.warn(
            '❗ Usuario autenticado no encontrado en la lista de usuarios.'
          );
        }
      });
    } else {
      console.warn('❗ No se pudo obtener usuario o rol desde el token.');
    }
  }

  guardarCompraInsumo() {
    if (this.compraInsumoForm.valid) {
      const compraData: CompraInsumo = {
        ...this.compraInsumoForm.getRawValue(),
        usuario: { idusuario: this.compraInsumoForm.get('idusuario')?.value }
      };

      this.ciS.insert(compraData).subscribe(() => {
        this.ciS.list().subscribe((data) => {
          this.ciS.setList(data);
        });

        this.snackBar.open('✅ Compra registrada con éxito', 'Cerrar', {
          duration: 3000,
          verticalPosition: 'bottom',
          horizontalPosition: 'center',
        });

        this.router.navigate(['/compra-insumo']);
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
  noFechaFuturaValidator(control: AbstractControl): ValidationErrors | null {
    const valor = control.value;
    if (!valor) return null;
    const fecha = new Date(valor);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // Comparar solo la fecha
    return fecha > hoy ? { fechaFutura: true } : null;
  }
  filtrarFechasPasadas = (date: Date | null): boolean => {
  if (!date) return false; // Si no hay fecha, no permitir
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0); // Asegúrate de comparar solo la fecha
  date.setHours(0, 0, 0, 0);
  return date <= hoy; // Solo permite fechas hasta hoy
};

}