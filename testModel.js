const { initDatabase, Alumno, sequelize } = require('./src/models');  

const testModel = async () => {
  try {
    // Inicializar la base de datos
    await initDatabase();
    
    // Crear un alumno de prueba
    const alumno = await Alumno.create({
      carnetSede: '1490',
      carnetAnio: '25',
      carnetNumero: '11111',
      primerNombre: 'Juan',
      segundoNombre: 'Carlos',
      primerApellido: 'Pérez',
      segundoApellido: 'García',
      telefono: '12345678',
      correoElectronico: 'juan@example.com',
      fechaNacimiento: '2000-05-15'
    });
    
    console.log('✅ Alumno creado:', alumno.carnetCompleto);
    console.log('Nombre completo:', alumno.nombreCompleto);
    console.log('Edad:', alumno.edad);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    // Cerrar la conexión
    await sequelize.close();
  }
};

testModel();