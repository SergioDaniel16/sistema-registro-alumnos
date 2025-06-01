const express = require('express');
const cors = require('cors');
require('dotenv').config();

const alumnoRoutes = require('./routes/alumnoRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/alumnos', alumnoRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({
    message: 'API de Sistema de Registro de Alumnos',
    version: '1.0.0',
    endpoints: {
      alumnos: '/api/alumnos',
      estadisticas: '/api/alumnos/estadisticas/edad',
      buscar: '/api/alumnos/buscar?sede=1490&anio=25'
    }
  });
});

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint no encontrado'
  });
});

module.exports = app;