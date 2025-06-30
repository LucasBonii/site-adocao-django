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
    <form onSubmit={handleLogin}>
      <h2>Login</h2>
      <input
        type="text"
        value={username || ''}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Usuário"
        required
      />
      <input
        type="password"
        value={password || ''}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Senha"
        required
      />
      {erro && <p style={{ color: 'red' }}>{erro}</p>}
      <button type="submit">Entrar</button>
    </form>
  );
}
