import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { VentaService } from '../../../services/venta.service';
import { Router } from '@angular/router';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { UsuarioService } from '../../../services/usuario.service';
import { TipoPagoService } from '../../../services/tipo-pago.service';
import { ProductoService } from '../../../services/producto.service';
import { LoginService } from '../../../services/login.service';

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
export class CreareditarventaComponent implements OnInit {
  ventaForm!: FormGroup;

  esVendedor: boolean = false; // Variable para controlar la edición del campo
  usuario: any = null; // 🔹 Nueva variable para almacenar el usuario autenticado
  listaUsuarios: any[] = []; // 🔹 Nueva variable para almacenar la lista de usuarios
  tiposPago: any[] = [];
  listaClientes: any[] = [];
  listarProductos: any[] = [];

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private ventaService: VentaService,
    private router: Router,
    private uS: UsuarioService, // Inyectar el servicio de usuario
    private tipoPagoService: TipoPagoService,
    private pS: ProductoService, // Inyectar el servicio de producto
    private loginservice: LoginService // Inyectar el servicio de login
  ) { }

  ngOnInit(): void {

    // Cargar clientes
   this.uS.listClientes().subscribe({
     next: (data) => this.listaClientes = data,
     error: () => this.snackBar.open('Error al cargar clientes', 'Cerrar', { duration: 3000 })
   });

    // Cargar productos
   this.pS.list().subscribe({
     next: (data) => this.listarProductos = data, // Asegúrate de que 'data' contiene 'idproducto' y 'nombre'
     error: () => this.snackBar.open('Error al cargar productos', 'Cerrar', { duration: 3000 })
   });

   // Cargar tipos de pago
   this.tipoPagoService.list().subscribe({
     next: (data) => this.tiposPago = data,
     error: () => this.snackBar.open('Error al cargar tipos de pago', 'Cerrar', { duration: 3000 })
   });

   // 1) Crea el formulario
   this.ventaForm = this.fb.group({
     clienteId: ['', Validators.required],
     vendedorId: [{ value: '', disabled: false }, Validators.required], // Asegúrate de usar 'vendedorId'
     factura: [false],
     especificarProducto: [false],
     productos: this.fb.array([]),
     montoManual: [{ value: '', disabled: false }, Validators.required],
     abono: ['', Validators.required],
     tipoPagoId: [{ value: '', disabled: true }, Validators.required]
   });

   const username = this.loginservice.showUser(); // "martin"
   const rol = this.loginservice.showRole(); // "Administrador"

   //
   if (username && rol) {
     this.uS.list().subscribe((usuarios) => {
       console.log('👉 usuarios:', usuarios);
       console.log('🔍 username token:', username);
       const usuarioEncontrado = usuarios.find(u => u.username === username);

       if (usuarioEncontrado) {
         this.usuario = usuarioEncontrado;
         this.esVendedor = usuarioEncontrado.rol.nombre_rol === 'Vendedor';

         if (rol === 'Administrador') {
           this.listaUsuarios = usuarios.filter(
             (u) => u.rol.nombre_rol === 'Vendedor'
           );
           this.ventaForm.get('vendedorId')?.enable();
         } else {
           this.ventaForm.get('vendedorId')?.setValue(usuarioEncontrado.idusuario);
           this.ventaForm.get('vendedorId')?.disable();
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

  getProductosDisponibles(index: number): any[] {
    const seleccionados = this.productos.controls
      .map((control, i) => i !== index ? control.get('producto')?.value : null)
      .filter(value => value !== null);
    return this.listarProductos.filter(product => !seleccionados.includes(product.idproducto));
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
        vendedorId: this.esVendedor ? this.usuario.idusuario : this.ventaForm.get('vendedorId')?.value,
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
        vendedorId: this.esVendedor ? this.usuario.idusuario : this.ventaForm.get('vendedorId')?.value,
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