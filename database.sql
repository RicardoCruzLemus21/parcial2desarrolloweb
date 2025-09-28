CREATE TABLE IF NOT EXISTS clientes (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    telefono VARCHAR(50) NOT NULL
);

-- Tabla ordenes
CREATE TABLE IF NOT EXISTS ordenes (
    id SERIAL PRIMARY KEY,
    cliente_id INTEGER NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
    platillo_nombre VARCHAR(255) NOT NULL,
    notes TEXT,
    estado VARCHAR(50) DEFAULT 'pending',  -- Posibles: pending, preparing, delivered
    creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

select * from ordenes;