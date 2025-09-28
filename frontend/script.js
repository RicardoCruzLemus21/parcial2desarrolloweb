let clienteId = null;

document.getElementById('form-registro').addEventListener('submit', async (e) => {
    e.preventDefault();
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const telefono = document.getElementById('telefono').value;
    const res = await fetch('https://tu-backend.onrender.com/clientes/registrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, telefono })
    });
    const data = await res.json();
    if (res.ok) {
        alert('Registrado! ID: ' + data.id);
        clienteId = data.id;
        mostrarSecciones();
    } else alert(data.error);
});

document.getElementById('form-login').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const telefono = document.getElementById('login-telefono').value;
    const res = await fetch('https://tu-backend.onrender.com/clientes/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, telefono })
    });
    const data = await res.json();
    if (res.ok) {
        clienteId = data.id;
        document.getElementById('cliente-id').value = clienteId; // Rellena el ID en el formulario
        mostrarSecciones();
        cargarOrdenes();
    } else alert(data.error);
});

document.getElementById('form-orden').addEventListener('submit', async (e) => {
    e.preventDefault();
    const cliente_id = clienteId; // Usar el clienteId global
    const platillo = document.getElementById('platillo').value;
    const notes = document.getElementById('notes').value;

    if (!platillo) {
        alert('Por favor, ingresa el nombre del platillo.');
        return;
    }

    const res = await fetch('https://tu-backend.onrender.com/ordenes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cliente_id, platillo_nombre: platillo, notes })
    });
    if (res.ok) {
        alert('Orden creada con éxito!');
        document.getElementById('platillo').value = ''; // Limpiar campo
        document.getElementById('notes').value = '';   // Limpiar notas
        cargarOrdenes();
    } else {
        const error = await res.json();
        alert('Error: ' + error.error);
    }
});

async function cargarOrdenes() {
    if (!clienteId) {
        document.getElementById('lista-ordenes').innerHTML = '<li>No has iniciado sesión.</li>';
        return;
    }
    const res = await fetch(`https://tu-backend.onrender.com/ordenes/${clienteId}`);
    if (res.ok) {
        const ordenes = await res.json();
        const lista = document.getElementById('lista-ordenes');
        lista.innerHTML = '';
        if (ordenes.length === 0) {
            lista.innerHTML = '<li>No hay órdenes registradas.</li>';
        } else {
            ordenes.forEach(orden => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <strong>Platillo:</strong> ${orden.platillo_nombre} | 
                    <strong>Estado:</strong> ${orden.estado} | 
                    <strong>Notas:</strong> ${orden.notes || 'Ninguna'} | 
                    <button onclick="avanzarEstado(${orden.id})">Avanzar Estado</button>
                `;
                lista.appendChild(li);
            });
        }
    } else {
        alert('Error al cargar órdenes');
    }
}

window.avanzarEstado = async (id) => {
    const res = await fetch(`https://tu-backend.onrender.com/ordenes/${id}/estado`, { method: 'PUT' });
    if (res.ok) {
        const data = await res.json();
        alert('Estado actualizado a: ' + data.nuevo_estado);
        cargarOrdenes();
    } else {
        alert('Error al actualizar estado');
    }
};

function mostrarSecciones() {
    document.getElementById('crear-orden').style.display = 'block';
    document.getElementById('ordenes').style.display = 'block';
    document.getElementById('cliente-id').value = clienteId; // Mostrar ID en el formulario
}