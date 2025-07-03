import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tipo, setTipo] = useState('tutor');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/usuarios/', {
        username,
        email,
        password,
        tipo,
      });
      navigate('/login');
    } catch (err) {
      console.error(err.response?.data);
      setErro('Erro ao registrar. Verifique os dados.');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <form onSubmit={handleRegister} className="p-4 border rounded" style={{ minWidth: '300px' }}>
        <h2 className="text-center mb-4">Criar Conta</h2>

        <input
          type="text"
          className="form-control mb-3"
          placeholder="Usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          className="form-control mb-3"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="form-control mb-3"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <select
          className="form-select mb-3"
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
        >
          <option value="tutor">Tutor</option>
          <option value="ong">ONG</option>
        </select>

        {erro && <p className="text-danger text-center">{erro}</p>}

        <div className="d-grid gap-2">
          <button type="submit" className="btn btn-success">
            Registrar
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => navigate('/login')}
          >
            Já tenho conta
          </button>
        </div>
      </form>
    </div>
  );
}
