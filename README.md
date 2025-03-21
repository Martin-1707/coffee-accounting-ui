# ☕ Coffee Accounting UI  

Interfaz de usuario para la gestión de ventas y cuentas en un negocio de café.  
Desarrollado con **Angular**, integrado con un backend en **Java** y **PostgreSQL**.  

## 🚀 Instalación  

### 1️⃣ Clonar el repositorio  
```sh
git clone https://github.com/tu-usuario/coffee-accounting-ui.git
cd coffee-accounting-ui

### 2️⃣ Instalar dependencias
npm install

### 3️⃣ Configurar el entorno
Copia el archivo de ejemplo de configuración y renómbralo a environment.ts:

cp src/environments/environment.example.ts src/environments/environment.ts

Edita src/environments/environment.ts y ajusta los valores según tu entorno:

export const environment = {
  production: false,
  base: "http://localhost:8083",
  dom: "localhost:8083"
};

### 4️⃣ Ejecutar la aplicación
ng serve
