const express = require('express');
const { Pool } = require('pg');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');  // Agregado para manejar CORS

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false  // Para Render
});

app.use(bodyParser.json());
app.use(cors());  // Habilita CORS para todas las rutas

// Endpoint 1: POST /clientes/registrar
app.post('/clientes/registrar', async (req, res) => {
    const { nombre, email, telefono } = req.body;
    try {
        const checkEmail = await pool.query('SELECT * FROM clientes WHERE email = $1', [email]);
        if (checkEmail.rows.length > 0) return res.status(400).json({ error: 'Email ya existe' });
        const result = await pool.query(
            'INSERT INTO clientes (nombre, email, telefono) VALUES ($1, $2, $3) RETURNING id',
            [nombre, email, telefono]
        );
        res.status(201).json({ id: result.rows[0].id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Endpoint 2: POST /clientes/login
app.post('/clientes/login', async (req, res) => {
    const { email, telefono } = req.body;
    try {
        const result = await pool.query('SELECT id FROM clientes WHERE email = $1 AND telefono = $2', [email, telefono]);
        if (result.rows.length === 0) return res.status(401).json({ error: 'Credenciales inválidas' });
        res.json({ id: result.rows[0].id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Endpoint 3: POST /ordenes
app.post('/ordenes', async (req, res) => {
    const { cliente_id, platillo_nombre, notes } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO ordenes (cliente_id, platillo_nombre, notes) VALUES ($1, $2, $3) RETURNING id',
            [cliente_id, platillo_nombre, notes]
        );
        res.status(201).json({ id: result.rows[0].id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Endpoint 4: GET /ordenes/:clienteId
app.get('/ordenes/:clienteId', async (req, res) => {
    const { clienteId } = req.params;
    try {
        const result = await pool.query('SELECT * FROM ordenes WHERE cliente_id = $1 ORDER BY creado DESC', [clienteId]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Endpoint 5: PUT /ordenes/:id/estado
app.put('/ordenes/:id/estado', async (req, res) => {
    const { id } = req.params;
    try {
        const current = await pool.query('SELECT estado FROM ordenes WHERE id = $1', [id]);
        if (current.rows.length === 0) return res.status(404).json({ error: 'Orden no encontrada' });
        let newEstado;
        if (current.rows[0].estado === 'pending') newEstado = 'preparing';
        else if (current.rows[0].estado === 'preparing') newEstado = 'delivered';
        else return res.status(400).json({ error: 'Estado no puede avanzar más' });
        await pool.query('UPDATE ordenes SET estado = $1 WHERE id = $2', [newEstado, id]);
        res.json({ nuevo_estado: newEstado });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(port, () => {
    console.log(`Backend corriendo en puerto ${port}`);
});