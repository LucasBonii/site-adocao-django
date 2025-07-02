// src/pages/Register.jsx
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
    <form onSubmit={handleRegister}>
      <h2>Registrar</h2>
      <input
        type="text"
        placeholder="Usuário"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
        <option value="tutor">Tutor</option>
        <option value="ong">ONG</option>
      </select>
      {erro && <p style={{ color: 'red' }}>{erro}</p>}
      <button type="submit">Registrar</button>
    </form>
  );
}


