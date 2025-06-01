const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Alumno = sequelize.define('Alumno', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // Carnet dividido en tres partes
  carnetSede: {
    type: DataTypes.STRING(4),
    allowNull: false,
    validate: {
      isNumeric: true,
      len: [4, 4]
    }
  },
  carnetAnio: {
    type: DataTypes.STRING(2),
    allowNull: false,
    validate: {
      isNumeric: true,
      len: [2, 2]
    }
  },
  carnetNumero: {
    type: DataTypes.STRING(5),
    allowNull: false,
    validate: {
      isNumeric: true,
      len: [5, 5]
    }
  },
  // Nombres
  primerNombre: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  segundoNombre: {
    type: DataTypes.STRING(50),
    allowNull: true,
    defaultValue: ''
  },
  // Apellidos
  primerApellido: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  segundoApellido: {
    type: DataTypes.STRING(50),
    allowNull: true,
    defaultValue: ''
  },
  // Contacto
  telefono: {
    type: DataTypes.STRING(15),
    allowNull: false,
    validate: {
      is: /^[0-9+\-\s()]+$/
    }
  },
  correoElectronico: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  // Fecha de nacimiento
  fechaNacimiento: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      isDate: true,
      isBefore: new Date().toISOString()
    }
  }
}, {
  tableName: 'alumnos',
  timestamps: true,
  // Crear un campo virtual para el carnet completo
  getterMethods: {
    carnetCompleto() {
      return `${this.carnetSede}-${this.carnetAnio}-${this.carnetNumero}`;
    },
    nombreCompleto() {
      return `${this.primerNombre} ${this.segundoNombre} ${this.primerApellido} ${this.segundoApellido}`.trim().replace(/\s+/g, ' ');
    },
    edad() {
      const hoy = new Date();
      const nacimiento = new Date(this.fechaNacimiento);
      let edad = hoy.getFullYear() - nacimiento.getFullYear();
      const mes = hoy.getMonth() - nacimiento.getMonth();
      if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--;
      }
      return edad;
    }
  }
});

module.exports = Alumno;