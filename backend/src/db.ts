import sqlite3 from 'sqlite3';
import path from 'path';

const dbPath = path.resolve(__dirname, '../database.sqlite');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS alumnos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    numero_cuenta TEXT UNIQUE NOT NULL,
    fecha_nacimiento TEXT NOT NULL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS materias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    codigo TEXT UNIQUE NOT NULL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS inscripciones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    alumno_id INTEGER NOT NULL,
    materia_id INTEGER NOT NULL,
    FOREIGN KEY(alumno_id) REFERENCES alumnos(id),
    FOREIGN KEY(materia_id) REFERENCES materias(id)
  )`);

  // Insertar usuario admin de prueba
  db.run(`INSERT OR IGNORE INTO alumnos (nombre, numero_cuenta, fecha_nacimiento) 
          VALUES ('Administrador de Prueba', 'admin', '00000000')`);
});

export default db;
