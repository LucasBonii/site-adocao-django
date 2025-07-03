import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro('');

    try {
      const response = await axios.post('http://localhost:8000/api/token/', {
        username,
        password,
      });

      if (response.data.access) {
        localStorage.setItem('access', response.data.access);
        localStorage.setItem('refresh', response.data.refresh);
        navigate('/dashboard');
      } else {
        setErro('Credenciais inválidas');
      }
    } catch (err) {
      setErro('Usuário ou senha inválidos');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <form onSubmit={handleLogin} className="p-4 border rounded" style={{ minWidth: '300px' }}>
        <h2 className="text-center mb-4">Login</h2>
        
        <input
          type="text"
          className="form-control mb-3"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Usuário"
          required
        />
        <input
          type="password"
          className="form-control mb-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Senha"
          required
        />
        {erro && <p className="text-danger text-center">{erro}</p>}
        
        <div className="d-grid gap-2">
          <button type="submit" className="btn btn-primary">
            Entrar
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => navigate('/register')}
          >
            Criar Conta
          </button>
        </div>
      </form>
    </div>
  );
}
