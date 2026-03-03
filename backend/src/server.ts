import express from 'express';
import cors from 'cors';
import db from './db';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// --- Login Estándar ---
app.post('/login', (req, res) => {
  const { numero_cuenta, fecha_nacimiento } = req.body;
  db.get('SELECT * FROM alumnos WHERE numero_cuenta = ? AND fecha_nacimiento = ?', [numero_cuenta, fecha_nacimiento], (err, row: any) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(401).json({ error: 'Número de cuenta o fecha incorrecta' });
    
    // Si la cuenta es 'admin', le damos el rol de admin para el frontend
    if (row.numero_cuenta === 'admin') {
      row.role = 'admin';
    }
    res.json(row);
  });
});

// --- Alumnos ---
app.get('/alumnos', (req, res) => {
  db.all('SELECT * FROM alumnos', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/alumnos', (req, res) => {
  const { nombre, numero_cuenta, fecha_nacimiento } = req.body;
  db.run('INSERT INTO alumnos (nombre, numero_cuenta, fecha_nacimiento) VALUES (?, ?, ?)', [nombre, numero_cuenta, fecha_nacimiento], function (err) {
    if (err) return res.status(400).json({ error: err.message });
    res.status(201).json({ id: this.lastID });
  });
});

// --- Materias ---
app.get('/materias', (req, res) => {
  db.all('SELECT * FROM materias', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/materias', (req, res) => {
  const { nombre, codigo } = req.body;
  db.run('INSERT INTO materias (nombre, codigo) VALUES (?, ?)', [nombre, codigo], function (err) {
    if (err) return res.status(400).json({ error: err.message });
    res.status(201).json({ id: this.lastID });
  });
});

// --- Inscripciones ---
app.get('/inscripciones', (req, res) => {
  const query = `
    SELECT i.id, a.nombre as alumno_nombre, a.numero_cuenta, m.nombre as materia_nombre, m.codigo
    FROM inscripciones i
    JOIN alumnos a ON i.alumno_id = a.id
    JOIN materias m ON i.materia_id = m.id
  `;
  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/inscripciones', (req, res) => {
  const { alumno_id, materia_id } = req.body;
  db.run('INSERT INTO inscripciones (alumno_id, materia_id) VALUES (?, ?)', [alumno_id, materia_id], function (err) {
    if (err) return res.status(400).json({ error: err.message });
    res.status(201).json({ id: this.lastID });
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
