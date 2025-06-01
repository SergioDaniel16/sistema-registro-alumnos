const { Alumno } = require('../models');
const { Op } = require('sequelize');

// Obtener todos los alumnos
const getAllAlumnos = async (req, res) => {
  try {
    const alumnos = await Alumno.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json({
      success: true,
      count: alumnos.length,
      data: alumnos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener alumnos',
      error: error.message
    });
  }
};

// Obtener un alumno por ID
const getAlumnoById = async (req, res) => {
  try {
    const { id } = req.params;
    const alumno = await Alumno.findByPk(id);
    
    if (!alumno) {
      return res.status(404).json({
        success: false,
        message: 'Alumno no encontrado'
      });
    }
    
    res.json({
      success: true,
      data: alumno
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener alumno',
      error: error.message
    });
  }
};

// Crear un nuevo alumno (Alta)
const createAlumno = async (req, res) => {
  try {
    const alumno = await Alumno.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Alumno creado exitosamente',
      data: alumno
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al crear alumno',
      error: error.message
    });
  }
};

// Actualizar un alumno (Cambio)
const updateAlumno = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Alumno.update(req.body, {
      where: { id }
    });
    
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Alumno no encontrado'
      });
    }
    
    const alumno = await Alumno.findByPk(id);
    res.json({
      success: true,
      message: 'Alumno actualizado exitosamente',
      data: alumno
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al actualizar alumno',
      error: error.message
    });
  }
};

// Eliminar un alumno (Baja)
const deleteAlumno = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Alumno.destroy({
      where: { id }
    });
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Alumno no encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Alumno eliminado exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar alumno',
      error: error.message
    });
  }
};

// Obtener estadísticas por edad
const getEstadisticasPorEdad = async (req, res) => {
  try {
    const alumnos = await Alumno.findAll({
      attributes: ['fechaNacimiento']
    });
    
    // Calcular edades y agrupar
    const estadisticas = {};
    
    alumnos.forEach(alumno => {
      const edad = alumno.edad;
      if (estadisticas[edad]) {
        estadisticas[edad]++;
      } else {
        estadisticas[edad] = 1;
      }
    });
    
    // Convertir a array ordenado
    const resultado = Object.entries(estadisticas)
      .map(([edad, cantidad]) => ({
        edad: parseInt(edad),
        cantidad
      }))
      .sort((a, b) => a.edad - b.edad);
    
    res.json({
      success: true,
      totalAlumnos: alumnos.length,
      data: resultado
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas',
      error: error.message
    });
  }
};

// Buscar alumnos por carnet
const buscarPorCarnet = async (req, res) => {
  try {
    const { sede, anio, numero } = req.query;
    
    const where = {};
    if (sede) where.carnetSede = sede;
    if (anio) where.carnetAnio = anio;
    if (numero) where.carnetNumero = numero;
    
    const alumnos = await Alumno.findAll({ where });
    
    res.json({
      success: true,
      count: alumnos.length,
      data: alumnos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al buscar alumnos',
      error: error.message
    });
  }
};

module.exports = {
  getAllAlumnos,
  getAlumnoById,
  createAlumno,
  updateAlumno,
  deleteAlumno,
  getEstadisticasPorEdad,
  buscarPorCarnet
};