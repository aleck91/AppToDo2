const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
// Middleware
app.use(bodyParser.json());
app.use(cors());
// Conectar a la base de datos SQLite
const db = new sqlite3.Database('./tasks.db', (err) => {
    if (err) {
    console.error('Error al abrir la base de datos:', err.message);
    } else {
    console.log('Conexión exitosa a la base de datos SQLite.');
    }
});
// Crear tabla si no existe
db.run(`CREATE TABLE IF NOT EXISTS tasks (
id INTEGER PRIMARY KEY AUTOINCREMENT,
nombre TEXT NOT NULL,
descripcion TEXT,
fecha TEXT NOT NULL,

completada INTEGER DEFAULT 0
)`);
// Iniciar el servidor
const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

//Agregar tarea
app.post('/tareas', (req, res) => {
    const { nombre } = req.body;
    const { descripcion } = req.body;
    const { fecha } = req.body;
    console.log(req.body);
    console.log(descripcion);
    console.log(fecha);
    const values = [nombre, descripcion, fecha];
        const query = `INSERT INTO tasks (nombre, descripcion, fecha) VALUES (?,?,?)`;
        db.run(query, [nombre, descripcion, fecha], function (err) {
    
        if (err) {
        res.status(400).json({ error: err.message });
        return;
        }
        res.json({ id: this.lastID,nombre, descripcion,fecha, completada: 0 });
        });
});

//Obtener tarea
app.get('/tareas', (req, res) => {
    const query = `SELECT * FROM tasks`;
    db.all(query, [], (err, rows) => {
    if (err) {
        res.status(400).json({ error: err.message });
        return;
    }
    res.json({ tareas: rows });
    });
});

//Eliminar tarea
app.delete('/tareas/:id', (req, res) => {
    const { id } = req.params;
    const query = `DELETE FROM tasks WHERE id = ?`;
    db.run(query, id, function (err) {
    if (err) {
    
    res.status(400).json({ error: err.message });
    return;
    }
    res.json({ message: 'Tarea eliminada correctamente' });
    });
});

app.get('/tareadone/:id', (req, res) => {
        const { id } = req.params;
        console.log(id)
        const query = `UPDATE tasks SET completada = 1 WHERE (id = ? )`;
        db.run(query, [id], function (err) {
    
        if (err) {
        res.status(400).json({ error: err.message });
        return;
        }
        res.json({ id: this.lastID, message: "Tarea actualizada" });
        });
});

app.get('/tareaundone/:id', (req, res) => {
    const { id } = req.params;
    console.log(id)
    const query = `UPDATE tasks SET completada = 0 WHERE (id = ? )`;
    db.run(query, [id], function (err) {

    if (err) {
    res.status(400).json({ error: err.message });
    return;
    }
    res.json({ id: this.lastID, message: "Tarea actualizada" });
    });
});
