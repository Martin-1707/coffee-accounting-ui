import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Usuario } from '../../../models/usuario';
import { UsuarioService } from '../../../services/usuario.service';
import { LoginService } from '../../../services/login.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-creareditarclientes',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule,
    MatIconModule,
  ],
  templateUrl: './creareditarclientes.component.html',
  styleUrl: './creareditarclientes.component.css'
})
export class CreareditarclientesComponent implements OnInit {
  form!: FormGroup;

  usuarioActual?: Usuario;
  rolActual = '';

  esEdicion = false;
  vendedores: Usuario[] = [];

  constructor(
    private fb: FormBuilder,
    private uS: UsuarioService,
    private login: LoginService,
    private snack: MatSnackBar,
    private dialogRef: MatDialogRef<CreareditarclientesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Usuario | null,
  ) { }

  ngOnInit(): void {
    this.esEdicion = !!this.data;

    this.rolActual = (this.login.showRole() ?? '').toLowerCase();

    this.uS.getCurrentUser().subscribe({
      next: (u) => (this.usuarioActual = u),
      error: () => (this.usuarioActual = undefined),
    });

    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      vendedorId: [{ value: '', disabled: true }, Validators.required], // admin/supervisor lo habilita
      enabled: [true],
    });

    const rol = (this.login.showRole() ?? '').toLowerCase();

    if (rol === 'administrador' || rol === 'supervisor') {
      this.uS.listVendedores().subscribe({
        next: (data) => {
          this.vendedores = (data ?? []).filter(v => v.rol?.nombre_rol === 'Vendedor');
          this.form.get('vendedorId')?.enable();
        },
        error: () => this.snack.open('Error al cargar vendedores', 'Cerrar', { duration: 3000 }),
      });
    } else {
      // Vendedor: no elige vendedor. Backend idealmente fuerza usuarioPadre.
      this.form.get('vendedorId')?.disable();
    }

    if (this.esEdicion && this.data) {
      this.form.patchValue({
        nombre: this.data.nombre,
        apellido: this.data.apellido,
        vendedorId: this.data.usuarioPadre?.idusuario ?? '',
        enabled: this.data.enabled ?? true,
      });
    }
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.snack.open('Completa los campos correctamente', 'Cerrar', { duration: 3000 });
      return;
    }

    const raw = this.form.getRawValue();

    // 1) Resolver vendedorIdFinal según rol
    let vendedorIdFinal: number | null = null;

    if (this.rolActual === 'administrador' || this.rolActual === 'supervisor') {
      vendedorIdFinal = Number(raw.vendedorId);
      if (!vendedorIdFinal) {
        this.snack.open('Selecciona un vendedor', 'Cerrar', { duration: 3000 });
        return;
      }
    } else {
      // rol vendedor
      vendedorIdFinal = this.usuarioActual?.idusuario ?? null;
      if (!vendedorIdFinal) {
        this.snack.open('No se pudo obtener el usuario actual', 'Cerrar', { duration: 3000 });
        return;
      }
    }

    // 2) Payload igual a Swagger
    const payload: any = {
      idusuario: this.esEdicion ? this.data!.idusuario : 0,
      nombre: raw.nombre,
      apellido: raw.apellido,
      enabled: raw.enabled ?? true,
      rol: { idrol: 4 }, // CLIENTE
      usuarioPadre: { idusuario: vendedorIdFinal },
    };

    // 3) Insert/Update
    const req$ = this.esEdicion ? this.uS.update(payload) : this.uS.insert(payload);

    req$.subscribe({
      next: () => {
        this.snack.open(this.esEdicion ? 'Cliente actualizado' : 'Cliente registrado', 'Cerrar', { duration: 3000 });
        this.dialogRef.close('saved');
      },
      error: (err) => {
        console.error('ERROR INSERT:', err);
        this.snack.open('Error al guardar: ' + this.extractErrorMessage(err), 'Cerrar', { duration: 3500 });
      },
    });


  }

  close(): void {
    this.dialogRef.close();
  }

  private extractErrorMessage(err: any): string {
    // Spring suele devolver string en err.error
    if (typeof err?.error === 'string') return err.error;

    //{ message: "..." }
    if (err?.error?.message) return err.error.message;

    // fallback
    if (err?.message) return err.message;

    return 'Solicitud inválida';
  }

}