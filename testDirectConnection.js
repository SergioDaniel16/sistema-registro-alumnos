const { Sequelize } = require('sequelize');

// Conexión directa sin usar variables de entorno
const sequelize = new Sequelize('ingenieria', 'postgres', 'manager', {
  host: 'localhost',
  port: 5432,
  dialect: 'postgres',
  logging: console.log
});

async function test() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión exitosa con credenciales directas');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

test();