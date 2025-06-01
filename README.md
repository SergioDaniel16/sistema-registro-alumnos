# Sistema de Registro de Alumnos

Sistema backend para gestión de alumnos con operaciones CRUD y estadísticas.

## Requisitos

- Node.js v20+ 
- PostgreSQL 15+
- npm v10+

## Instalación

1. Clonar el repositorio
```bash
git clone [url-del-repositorio]
cd sistema-registro-alumnos

2. Instalar dependencias
npm install

3. Configurar variables de entorno
# Copiar el archivo de ejemplo
cp .env.example .env

# Editar .env con tus credenciales de PostgreSQL

4. Crear la base de datos
CREATE DATABASE ingenieria;


Uso
Desarrollo

npm run dev

Producción

npm start

Endpoints de la API
Método - Endpoint - Descripción 
GET	|/api/alumnos 			Obtener todos los alumnos
GET	|/api/alumnos/:id 		Obtener un alumno por ID
POST	|/api/alumnos 			Crear nuevo alumno
PUT	|/api/alumnos/:id 		Actualizar alumno
DELETE	|/api/alumnos/:id 		Eliminar alumno
GET	|/api/alumnos/estadisticas/edad Estadísticas por edad
GET	|/api/alumnos/buscar 		Buscar por carnet

Estructura del Proyecto

sistema-registro-alumnos/
├── src/
│   ├── config/         # Configuración de BD
│   ├── controllers/    # Controladores
│   ├── models/         # Modelos Sequelize
│   ├── routes/         # Rutas de Express
│   └── app.js          # Configuración de Express
├── .env                # Variables de entorno
├── server.js           # Punto de entrada
└── package.json        # Dependencias

Modelo de Datos - Alumno

carnetSede: String(4) - Sede del carnet
carnetAnio: String(2) - Año del carnet
carnetNumero: String(5) - Número del carnet
primerNombre: String(50) - Requerido
segundoNombre: String(50) - Opcional
primerApellido: String(50) - Requerido
segundoApellido: String(50) - Opcional
telefono: String(15) - Requerido
correoElectronico: String(100) - Email válido
fechaNacimiento: Date - Fecha de nacimiento