const { sequelize } = require('../config/database');
const Alumno = require('./Alumno');

const initDatabase = async () => {
  try {
    // Sincronizar modelos con la base de datos
    await sequelize.sync({ alter: true });
    console.log('✅ Base de datos sincronizada correctamente');
  } catch (error) {
    console.error('❌ Error al sincronizar la base de datos:', error);
  }
};

module.exports = {
  sequelize,
  Alumno,
  initDatabase
};