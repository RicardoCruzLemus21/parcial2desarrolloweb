let clienteId = null;

// Registrar
document.getElementById('form-registro').addEventListener('submit', async (e) => {
    e.preventDefault();
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const telefono = document.getElementById('telefono').value;
    const res = await fetch('http://localhost:3000/clientes/registrar', {
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

// Login
document.getElementById('form-login').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const telefono = document.getElementById('login-telefono').value;
    const res = await fetch('http://localhost:3000/clientes/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, telefono })
    });
    const data = await res.json();
    if (res.ok) {
        clienteId = data.id;
        mostrarSecciones();
        cargarOrdenes();
    } else alert(data.error);
});

// Crear Orden
document.getElementById('form-orden').addEventListener('submit', async (e) => {
    e.preventDefault();
    const platillo = document.getElementById('platillo').value;
    const notes = document.getElementById('notes').value;
    const res = await fetch('http://localhost:3000/ordenes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cliente_id: clienteId, platillo_nombre: platillo, notes })
    });
    if (res.ok) {
        alert('Orden creada!');
        cargarOrdenes();
    } else alert('Error');
});

// Cargar Órdenes
async function cargarOrdenes() {
    const res = await fetch(`http://localhost:3000/ordenes/${clienteId}`);
    const ordenes = await res.json();
    const lista = document.getElementById('lista-ordenes');
    lista.innerHTML = '';
    ordenes.forEach(orden => {
        const li = document.createElement('li');
        li.innerHTML = `
            Platillo: ${orden.platillo_nombre} | Estado: ${orden.estado} | Notas: ${orden.notes}
            <button onclick="avanzarEstado(${orden.id})">Avanzar Estado</button>
        `;
        lista.appendChild(li);
    });
}

// Avanzar Estado
window.avanzarEstado = async (id) => {
    const res = await fetch(`http://localhost:3000/ordenes/${id}/estado`, { method: 'PUT' });
    if (res.ok) {
        alert('Estado actualizado!');
        cargarOrdenes();
    } else alert('Error');
};

// Mostrar secciones después de login/registro
function mostrarSecciones() {
    document.getElementById('crear-orden').style.display = 'block';
    document.getElementById('ordenes').style.display = 'block';
}