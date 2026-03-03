# Sistema de Inscripción Escolar

Un sistema web completo y minimalista para gestionar inscripciones escolares, construido con una arquitectura Cliente-Servidor (Frontend/Backend).

## Tecnologías Utilizadas

### Frontend
- **React** (con TypeScript)
- **Vite** (como empaquetador rápido)
- **Axios** (para peticiones HTTP)
- **CSS Puro** (diseño minimalista y responsivo, sin frameworks)

### Backend
- **Node.js** (con TypeScript)
- **Express.js** (servidor web)
- **SQLite3** (base de datos relacional ligera)

---

## Requisitos Previos

Asegúrate de tener instalados los siguientes programas en tu computadora:
- [Node.js](https://nodejs.org/) (Versión 16 o superior)
- npm (viene incluido con Node.js)

---

## Instalación

1. **Clona el repositorio:**
   ```bash
   git clone https://github.com/KaiBit23/Sistema_Inscripcion.git
   cd Sistema_Inscripcion
   ```

2. **Instala las dependencias del Backend:**
   ```bash
   cd backend
   npm install
   cd ..
   ```

3. **Instala las dependencias del Frontend:**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

---

## Cómo Ejecutar el Proyecto

### Opción 1: Ejecución Automática (Windows)
Si estás en Windows, simplemente haz doble clic en el archivo **`run.bat`** ubicado en la carpeta principal. Esto abrirá dos ventanas de terminal y levantará ambos servidores automáticamente.

### Opción 2: Ejecución Manual

**1. Iniciar el Backend (Terminal 1):**
```bash
cd backend
npx ts-node src/server.ts
```
*El servidor backend correrá en `http://localhost:3001`*

**2. Iniciar el Frontend (Terminal 2):**
```bash
cd frontend
npm run dev
```
*Vite te dará una URL local (usualmente `http://localhost:5173`) para ver la aplicación en tu navegador.*

---

## Cuentas de Acceso

La base de datos se genera automáticamente al iniciar el servidor por primera vez. Para empezar a usar el sistema y configurarlo, usa la cuenta de administrador predeterminada:

- **Número de Cuenta:** `admin`
- **Fecha de Nacimiento:** `00000000`

> **Nota:** Al ingresar con esta cuenta, serás redirigido a la pestaña "SISTEMA", donde podrás dar de alta nuevos alumnos y materias. Los nuevos alumnos registrados podrán ingresar usando sus propias credenciales.
