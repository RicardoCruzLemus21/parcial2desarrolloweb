let clienteId = null;

document.getElementById('form-orden').addEventListener('submit', async (e) => {
    e.preventDefault();
    const platillo = document.getElementById('platillo').value;
    const notes = document.getElementById('notes').value;
    const res = await fetch('https://tu-backend.onrender.com/ordenes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cliente_id: clienteId, platillo_nombre: platillo, notes })
    });
    if (res.ok) {
        alert('Orden creada!');
        cargarOrdenes();
    } else {
        const error = await res.json();
        alert('Error: ' + error.error);
    }
});

async function cargarOrdenes() {
    const res = await fetch(`https://tu-backend.onrender.com/ordenes/${clienteId}`);
    if (res.ok) {
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
    } else alert('Error al cargar órdenes');
}

window.avanzarEstado = async (id) => {
    const res = await fetch(`https://tu-backend.onrender.com/ordenes/${id}/estado`, { method: 'PUT' });
    if (res.ok) {
        alert('Estado actualizado!');
        cargarOrdenes();
    } else alert('Error al actualizar estado');
};