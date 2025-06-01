// URL base de la API
const API_URL = 'http://localhost:3000/api/alumnos';

// Variables globales
let alumnos = [];
let alumnoEditando = null;

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', () => {
    cargarAlumnos();
    cargarEstadisticas();
});

// Función para cambiar entre tabs
function showTab(tabName) {
    // Ocultar todos los tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });

    // Mostrar el tab seleccionado
    document.getElementById(`${tabName}-tab`).classList.add('active');
    event.target.classList.add('active');

    // Cargar datos según el tab
    if (tabName === 'estadisticas') {
        cargarEstadisticas();
    }
}

// Cargar lista de alumnos
async function cargarAlumnos() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        
        if (data.success) {
            alumnos = data.data;
            mostrarAlumnos(alumnos);
        }
    } catch (error) {
        console.error('Error al cargar alumnos:', error);
        mostrarError('Error al cargar los alumnos');
    }
}

// Mostrar alumnos en la tabla
function mostrarAlumnos(listaAlumnos) {
    const tbody = document.getElementById('tbody-alumnos');
    
    if (listaAlumnos.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="loading">No hay alumnos registrados</td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = listaAlumnos.map(alumno => `
        <tr>
            <td>${alumno.carnetSede}-${alumno.carnetAnio}-${alumno.carnetNumero}</td>
            <td>${alumno.primerNombre} ${alumno.segundoNombre || ''} ${alumno.primerApellido} ${alumno.segundoApellido || ''}</td>
            <td>${calcularEdad(alumno.fechaNacimiento)} años</td>
            <td>${alumno.telefono}</td>
            <td>${alumno.correoElectronico}</td>
            <td>
                <button class="btn btn-warning" onclick="editarAlumno(${alumno.id})" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-danger" onclick="eliminarAlumno(${alumno.id})" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Calcular edad
function calcularEdad(fechaNacimiento) {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--;
    }
    
    return edad;
}

// Buscar alumnos
function buscarAlumnos() {
    const termino = document.getElementById('buscar').value.toLowerCase();
    
    const alumnosFiltrados = alumnos.filter(alumno => {
        const nombreCompleto = `${alumno.primerNombre} ${alumno.segundoNombre || ''} ${alumno.primerApellido} ${alumno.segundoApellido || ''}`.toLowerCase();
        const carnetCompleto = `${alumno.carnetSede}-${alumno.carnetAnio}-${alumno.carnetNumero}`;
        
        return nombreCompleto.includes(termino) || carnetCompleto.includes(termino);
    });
    
    mostrarAlumnos(alumnosFiltrados);
}

// Mostrar formulario para nuevo alumno
function mostrarFormularioNuevo() {
    alumnoEditando = null;
    document.getElementById('modal-titulo').textContent = 'Nuevo Alumno';
    document.getElementById('formulario-alumno').reset();
    document.getElementById('modal').style.display = 'block';
}

// Editar alumno
async function editarAlumno(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const data = await response.json();
        
        if (data.success) {
            alumnoEditando = data.data;
            document.getElementById('modal-titulo').textContent = 'Editar Alumno';
            
            // Llenar el formulario con los datos
            document.getElementById('carnetSede').value = alumnoEditando.carnetSede;
            document.getElementById('carnetAnio').value = alumnoEditando.carnetAnio;
            document.getElementById('carnetNumero').value = alumnoEditando.carnetNumero;
            document.getElementById('primerNombre').value = alumnoEditando.primerNombre;
            document.getElementById('segundoNombre').value = alumnoEditando.segundoNombre || '';
            document.getElementById('primerApellido').value = alumnoEditando.primerApellido;
            document.getElementById('segundoApellido').value = alumnoEditando.segundoApellido || '';
            document.getElementById('telefono').value = alumnoEditando.telefono;
            document.getElementById('correoElectronico').value = alumnoEditando.correoElectronico;
            document.getElementById('fechaNacimiento').value = alumnoEditando.fechaNacimiento;
            
            document.getElementById('modal').style.display = 'block';
        }
    } catch (error) {
        console.error('Error al cargar alumno:', error);
        mostrarError('Error al cargar los datos del alumno');
    }
}

// Guardar alumno (crear o actualizar)
async function guardarAlumno(event) {
    event.preventDefault();
    
    const datos = {
        carnetSede: document.getElementById('carnetSede').value,
        carnetAnio: document.getElementById('carnetAnio').value,
        carnetNumero: document.getElementById('carnetNumero').value,
        primerNombre: document.getElementById('primerNombre').value,
        segundoNombre: document.getElementById('segundoNombre').value,
        primerApellido: document.getElementById('primerApellido').value,
        segundoApellido: document.getElementById('segundoApellido').value,
        telefono: document.getElementById('telefono').value,
        correoElectronico: document.getElementById('correoElectronico').value,
        fechaNacimiento: document.getElementById('fechaNacimiento').value
    };

    try {
        const url = alumnoEditando ? `${API_URL}/${alumnoEditando.id}` : API_URL;
        const method = alumnoEditando ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });

        const data = await response.json();
        
        if (data.success) {
            cerrarModal();
            cargarAlumnos();
            mostrarMensaje(alumnoEditando ? 'Alumno actualizado correctamente' : 'Alumno creado correctamente');
        } else {
            mostrarError(data.error || 'Error al guardar el alumno');
        }
    } catch (error) {
        console.error('Error al guardar:', error);
        mostrarError('Error al guardar el alumno');
    }
}

// Eliminar alumno
async function eliminarAlumno(id) {
    if (!confirm('¿Está seguro de eliminar este alumno?')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        const data = await response.json();
        
        if (data.success) {
            cargarAlumnos();
            mostrarMensaje('Alumno eliminado correctamente');
        } else {
            mostrarError('Error al eliminar el alumno');
        }
    } catch (error) {
        console.error('Error al eliminar:', error);
        mostrarError('Error al eliminar el alumno');
    }
}

// Cargar estadísticas
async function cargarEstadisticas() {
    try {
        const response = await fetch(`${API_URL}/estadisticas/edad`);
        const data = await response.json();
        
        if (data.success) {
            mostrarEstadisticas(data);
        }
    } catch (error) {
        console.error('Error al cargar estadísticas:', error);
        document.getElementById('stats-content').innerHTML = '<div class="loading">Error al cargar estadísticas</div>';
    }
}

// Mostrar estadísticas
function mostrarEstadisticas(data) {
    const container = document.getElementById('stats-content');
    
    if (data.data.length === 0) {
        container.innerHTML = '<div class="loading">No hay datos para mostrar</div>';
        return;
    }

    // Crear resumen
    const totalAlumnos = data.totalAlumnos;
    const edadPromedio = data.data.reduce((sum, item) => sum + (item.edad * item.cantidad), 0) / totalAlumnos;
    
    let html = `
        <div class="stats-summary">
            <div class="stat-card">
                <h3>Total de Alumnos</h3>
                <div class="value">${totalAlumnos}</div>
            </div>
            <div class="stat-card">
                <h3>Edad Promedio</h3>
                <div class="value">${edadPromedio.toFixed(1)} años</div>
            </div>
        </div>
        <h3 style="margin-top: 30px; margin-bottom: 20px;">Distribución por Edad</h3>
    `;

    // Crear tabla de distribución
    html += '<table style="width: 100%;">';
    html += '<thead><tr><th>Edad</th><th>Cantidad</th><th>Porcentaje</th></tr></thead>';
    html += '<tbody>';
    
    data.data.forEach(item => {
        const porcentaje = ((item.cantidad / totalAlumnos) * 100).toFixed(1);
        html += `
            <tr>
                <td>${item.edad} años</td>
                <td>${item.cantidad}</td>
                <td>
                    <div style="display: flex; align-items: center;">
                        <div style="width: 100px; background: #e5e7eb; height: 20px; border-radius: 10px; margin-right: 10px;">
                            <div style="width: ${porcentaje}%; background: #667eea; height: 100%; border-radius: 10px;"></div>
                        </div>
                        ${porcentaje}%
                    </div>
                </td>
            </tr>
        `;
    });
    
    html += '</tbody></table>';
    container.innerHTML = html;
}

// Cerrar modal
function cerrarModal() {
    document.getElementById('modal').style.display = 'none';
    document.getElementById('formulario-alumno').reset();
    alumnoEditando = null;
}

// Mostrar mensaje de éxito
function mostrarMensaje(mensaje) {
    alert(mensaje); // Por simplicidad usamos alert, pero podrías hacer un toast
}

// Mostrar mensaje de error
function mostrarError(mensaje) {
    alert('Error: ' + mensaje);
}

// Cerrar modal al hacer clic fuera
window.onclick = function(event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        cerrarModal();
    }
}

// Búsqueda en tiempo real
document.getElementById('buscar').addEventListener('keyup', buscarAlumnos);