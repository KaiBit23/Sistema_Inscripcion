import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:3001';

interface Alumno {
  id: number;
  nombre: string;
  numero_cuenta: string;
  fecha_nacimiento: string;
  role?: string;
}

interface Materia {
  id: number;
  nombre: string;
  codigo: string;
}

interface Inscripcion {
  id: number;
  alumno_nombre: string;
  numero_cuenta: string;
  materia_nombre: string;
  codigo: string;
}

function App() {
  const [currentUser, setCurrentUser] = useState<Alumno | null>(null);
  const [activeTab, setActiveTab] = useState<'inscripcion' | 'mis-materias' | 'admin'>('inscripcion');
  
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [inscripciones, setInscripciones] = useState<Inscripcion[]>([]);

  // Login states
  const [loginCuenta, setLoginCuenta] = useState('');
  const [loginFecha, setLoginFecha] = useState('');

  // Form states (Admin)
  const [nombreAlumno, setNombreAlumno] = useState('');
  const [cuentaAlumno, setCuentaAlumno] = useState('');
  const [fechaNacAlumno, setFechaNacAlumno] = useState('');
  const [nombreMateria, setNombreMateria] = useState('');
  const [codigoMateria, setCodigoMateria] = useState('');
  const [selectedMateria, setSelectedMateria] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resAlumnos, resMaterias, resInscripciones] = await Promise.all([
        axios.get(`${API_URL}/alumnos`),
        axios.get(`${API_URL}/materias`),
        axios.get(`${API_URL}/inscripciones`),
      ]);
      setAlumnos(resAlumnos.data);
      setMaterias(resMaterias.data);
      setInscripciones(resInscripciones.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/login`, { 
        numero_cuenta: loginCuenta, 
        fecha_nacimiento: loginFecha 
      });
      setCurrentUser(res.data);
      // Si es admin, cambiar a pestaña de administración automáticamente
      if (res.data.role === 'admin') {
        setActiveTab('admin');
      } else {
        setActiveTab('inscripcion');
      }
    } catch (err) {
      alert('Número de cuenta o fecha incorrectos.');
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setLoginCuenta('');
    setLoginFecha('');
  };

  const addAlumno = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombreAlumno || !cuentaAlumno || !fechaNacAlumno) return;
    try {
      await axios.post(`${API_URL}/alumnos`, { 
        nombre: nombreAlumno, 
        numero_cuenta: cuentaAlumno,
        fecha_nacimiento: fechaNacAlumno
      });
      alert('Alumno registrado correctamente');
      setNombreAlumno('');
      setCuentaAlumno('');
      setFechaNacAlumno('');
      fetchData();
    } catch (error) {
      alert('Error al registrar alumno.');
    }
  };

  const addMateria = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombreMateria || !codigoMateria) return;
    try {
      await axios.post(`${API_URL}/materias`, { nombre: nombreMateria, codigo: codigoMateria });
      alert('Materia creada correctamente');
      setNombreMateria('');
      setCodigoMateria('');
      fetchData();
    } catch (error) {
      alert('Error al registrar materia.');
    }
  };

  const enroll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !selectedMateria) return;
    try {
      await axios.post(`${API_URL}/inscripciones`, { 
        alumno_id: currentUser.id, 
        materia_id: parseInt(selectedMateria) 
      });
      alert('Inscripción completada');
      fetchData();
    } catch (error) {
      alert('Error al inscribir.');
    }
  };

  if (!currentUser) {
    return (
      <div className="login-container">
        <div className="login-card">
          <h1>SISTEMA ESCOLAR</h1>
          <p>Portal de Acceso</p>
          <form onSubmit={login}>
            <input 
              type="text" 
              placeholder="Número de Cuenta" 
              value={loginCuenta} 
              onChange={(e) => setLoginCuenta(e.target.value)} 
              required 
            />
            <input 
              type="text" 
              placeholder="Fecha (AAAAMMDD)" 
              value={loginFecha} 
              onChange={(e) => setLoginFecha(e.target.value)} 
              maxLength={8} 
              required 
            />
            <button type="submit">ENTRAR</button>
          </form>
          <div className="admin-hint">
            Ingresa tus credenciales para continuar.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="nav-logo">CONTROL ESCOLAR</div>
        <div className="nav-links">
          {currentUser.role !== 'admin' && (
            <>
              <button className={activeTab === 'inscripcion' ? 'active' : ''} onClick={() => setActiveTab('inscripcion')}>INSCRIBIR</button>
              <button className={activeTab === 'mis-materias' ? 'active' : ''} onClick={() => setActiveTab('mis-materias')}>MI CARGA</button>
            </>
          )}
          {currentUser.role === 'admin' && (
            <button className={activeTab === 'admin' ? 'active' : ''} onClick={() => setActiveTab('admin')}>SISTEMA</button>
          )}
        </div>
        <div className="nav-user">
          <span style={{fontWeight: 600}}>{currentUser.nombre}</span>
          <button className="logout-btn" onClick={logout}>SALIR</button>
        </div>
      </nav>

      <main className="content">
        {activeTab === 'inscripcion' && (
          <section className="section-card">
            <h2>NUEVA INSCRIPCIÓN</h2>
            <p className="subtitle">Elige una de las materias disponibles para inscribirte.</p>
            <form onSubmit={enroll} className="form-row">
              <select value={selectedMateria} onChange={(e) => setSelectedMateria(e.target.value)} required>
                <option value="">-- Elige una Materia --</option>
                {materias.map(m => <option key={m.id} value={m.id}>{m.nombre} - {m.codigo}</option>)}
              </select>
              <button type="submit">INSCRIBIR MATERIA</button>
            </form>
          </section>
        )}

        {activeTab === 'mis-materias' && (
          <section className="section-card">
            <h2>MI CARGA ACADÉMICA</h2>
            <p className="subtitle">Materias inscritas para el ciclo actual.</p>
            <table className="clean-table">
              <thead>
                <tr>
                  <th>MATERIA</th>
                  <th>CLAVE</th>
                </tr>
              </thead>
              <tbody>
                {inscripciones.filter(i => i.numero_cuenta === currentUser.numero_cuenta).map(i => (
                  <tr key={i.id}>
                    <td>{i.materia_nombre}</td>
                    <td>{i.codigo}</td>
                  </tr>
                ))}
                {inscripciones.filter(i => i.numero_cuenta === currentUser.numero_cuenta).length === 0 && (
                  <tr><td colSpan={2} style={{textAlign: 'center', padding: '3rem', color: '#bdc3c7'}}>No hay registros de inscripción actualmente.</td></tr>
                )}
              </tbody>
            </table>
          </section>
        )}

        {activeTab === 'admin' && (
          <div className="admin-grid">
            <section className="section-card">
              <h2>GESTIÓN DE ALUMNOS</h2>
              <form onSubmit={addAlumno}>
                <input type="text" placeholder="Nombre completo" value={nombreAlumno} onChange={(e) => setNombreAlumno(e.target.value)} required />
                <input type="text" placeholder="Número de cuenta" value={cuentaAlumno} onChange={(e) => setCuentaAlumno(e.target.value)} required />
                <input type="text" placeholder="Fecha Nacimiento (AAAAMMDD)" value={fechaNacAlumno} onChange={(e) => setFechaNacAlumno(e.target.value)} required />
                <button type="submit">DAR DE ALTA</button>
              </form>
              <ul className="mini-list">
                {alumnos.map(a => <li key={a.id}>{a.nombre} - {a.numero_cuenta}</li>)}
              </ul>
            </section>

            <section className="section-card">
              <h2>GESTIÓN DE MATERIAS</h2>
              <form onSubmit={addMateria}>
                <input type="text" placeholder="Nombre materia" value={nombreMateria} onChange={(e) => setNombreMateria(e.target.value)} required />
                <input type="text" placeholder="Código" value={codigoMateria} onChange={(e) => setCodigoMateria(e.target.value)} required />
                <button type="submit">CREAR MATERIA</button>
              </form>
              <ul className="mini-list">
                {materias.map(m => <li key={m.id}>{m.nombre} - {m.codigo}</li>)}
              </ul>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
