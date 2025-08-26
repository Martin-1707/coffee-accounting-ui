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

  fechaActual: Date = new Date();

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

  private formatDate(date: Date): string {
    const d = new Date(date);
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    return `${d.getFullYear()}-${month}-${day}`;
  }

  ngOnInit(): void {

    // ❌ ya no cargamos todos los clientes
    // this.uS.listClientes().subscribe({
    //   next: (data) => this.listaClientes = data,
    //   error: () => this.snackBar.open('Error al cargar clientes', 'Cerrar', { duration: 3000 })
    // });

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
      clienteId: [{ value: '', disabled: true }, Validators.required], // <-- inicia deshabilitado
      vendedorId: [{ value: '', disabled: false }, Validators.required], // Asegúrate de usar 'vendedorId'
      factura: [false],
      especificarProducto: [false],
      productos: this.fb.array([]),
      fechaVenta: [{ value: this.formatDate(this.fechaActual), disabled: true }],
      montoManual: [{ value: '', disabled: false }, Validators.required],
      habilitarAbono: [false], // <--- nuevo control para el checkbox
      abono: [{ value: 0, disabled: true }, [Validators.required, Validators.min(1)]],
      tipoPagoId: [{ value: '', disabled: true }, Validators.required]
    });

    const username = this.loginservice.showUser(); // "martin"
    const rol = this.loginservice.showRole(); // "Administrador"

    //
    if (username && rol) {
      this.uS.getVisibles().subscribe((usuarios) => {
        console.log('👉 usuarios:', usuarios);
        console.log('🔍 username token:', username);
        const usuarioEncontrado = usuarios.find(u => u.username === username);

        if (usuarioEncontrado) {
          this.usuario = usuarioEncontrado;
          this.esVendedor = usuarioEncontrado.rol.nombre_rol === 'Vendedor';

          if (rol === 'Administrador' || rol === 'Supervisor') {
            // 👉 El admin/supervisor selecciona vendedor y luego clientes
            this.listaUsuarios = usuarios.filter(
              (u) => u.rol.nombre_rol === 'Vendedor'
            );
            this.ventaForm.get('vendedorId')?.enable();

            // 🔍 Escuchar cambios en vendedorId
            this.ventaForm.get('vendedorId')?.valueChanges.subscribe((vendedorId) => {
              const clienteCtrl = this.ventaForm.get('clienteId');
              if (vendedorId) {
                clienteCtrl?.enable(); // Habilita clienteId
                this.uS.listClientesPorVendedor(vendedorId).subscribe({
                  next: (clientes) => this.listaClientes = clientes,
                  error: () => this.snackBar.open('Error al cargar clientes del vendedor', 'Cerrar', { duration: 3000 })
                });
              } else {
                clienteCtrl?.disable(); // Deshabilita clienteId
                clienteCtrl?.setValue('');
                this.listaClientes = [];
              }
            });
          } else {
            // 👉 Vendedor autenticado: carga sus propios clientes
            this.ventaForm.get('vendedorId')?.setValue(usuarioEncontrado.idusuario);
            this.ventaForm.get('vendedorId')?.disable();
            this.ventaForm.get('clienteId')?.enable(); // Habilita clienteId para vendedor

            this.uS.listMisClientes().subscribe({
              next: (clientes) => this.listaClientes = clientes,
              error: () => this.snackBar.open('Error al cargar mis clientes', 'Cerrar', { duration: 3000 })
            });
          }
        }
      });
    }

    // Escuchar cambios en el checkbox de abono
    this.ventaForm.get('habilitarAbono')?.valueChanges.subscribe((habilitar) => {
      const abonoCtrl = this.ventaForm.get('abono');
      if (habilitar) {
        abonoCtrl?.enable();
        abonoCtrl?.setValue('');
      } else {
        abonoCtrl?.disable();
        abonoCtrl?.setValue(0);
      }
    });

    // Ajusta también la lógica de tipoPagoId para que dependa de abono > 0
    this.ventaForm.get('abono')!.valueChanges.subscribe(value => {
      if (value && Number(value) > 0) {
        this.ventaForm.get('tipoPagoId')!.enable();
      } else {
        this.ventaForm.get('tipoPagoId')!.disable();
        this.ventaForm.get('tipoPagoId')!.setValue('');
      }
    });

    // 👉 Activar o desactivar controles según "especificarProducto"
    this.ventaForm.get('especificarProducto')?.valueChanges.subscribe((valor) => {
      const montoManualCtrl = this.ventaForm.get('montoManual');
      const productosCtrl = this.ventaForm.get('productos') as FormArray;

      if (valor) {
        montoManualCtrl?.disable();
        if (productosCtrl.length === 0) this.addProducto(); // al menos 1 por defecto
      } else {
        montoManualCtrl?.enable();
        productosCtrl.clear();
      }
    });

    // 👉 Activar o desactivar control de fecha
    this.ventaForm.addControl('especificarFecha', new FormControl(false));
    this.ventaForm.get('especificarFecha')?.valueChanges.subscribe((valor) => {
      const fechaCtrl = this.ventaForm.get('fechaVenta');
      if (valor) {
        fechaCtrl?.enable();
      } else {
        fechaCtrl?.disable();
        fechaCtrl?.setValue(this.formatDate(this.fechaActual)); // <-- aquí el formato correcto
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
    // 👇 Asegura que abono sea 0 si está vacío, null o NaN
    const abonoValue = Number(formData.abono);
    const abono = isNaN(abonoValue) ? 0 : abonoValue;

    if (formData.especificarProducto) {
      const ventaData = {
        clienteId: Number(formData.clienteId),
        vendedorId: this.esVendedor ? this.usuario.idusuario : this.ventaForm.get('vendedorId')?.value,
        factura: formData.factura,
        abono: abono,
        productos: formData.productos.map((p: any) => ({
          id: Number(p.producto),
          cantidad: Number(p.cantidad)
        })),
        tipoPagoId: Number(formData.tipoPagoId),
        fechaVenta: formData.fechaVenta
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
      const ventaSimpleData: any = {
        clienteId: Number(formData.clienteId),
        vendedorId: this.esVendedor ? this.usuario.idusuario : this.ventaForm.get('vendedorId')?.value,
        factura: formData.factura,
        montoManual: Number(formData.montoManual),
        abono: abono, // 👈 aquí siempre será 0 o el valor correcto
        tipoPagoId: Number(formData.tipoPagoId)
      };

      if (formData.especificarFecha) {
        ventaSimpleData.fechaVenta = formData.fechaVenta;
      }

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