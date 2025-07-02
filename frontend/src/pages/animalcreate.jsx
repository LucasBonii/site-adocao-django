import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AnimalCreate() {
  const [nome, setNome] = useState('');
  const [especie, setEspecie] = useState('');
  const [porte, setPorte] = useState('');
  const [sexo, setSexo] = useState('');
  const [idade, setIdade] = useState('');
  const [descricao, setDescricao] = useState('');
  const [status, setStatus] = useState('Disponível');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('access');
      await axios.post('http://localhost:8000/api/animais/', {
        nome,
        especie,
        porte,
        sexo,
        idade: Number(idade),  // <--- AQUI
        descricao,
        status,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate('/animais');
    } catch (err) {
      setErro('Erro ao cadastrar animal. Verifique os dados.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Cadastrar Animal</h2>
      <input type="text" placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
      <input type="text" placeholder="Espécie" value={especie} onChange={(e) => setEspecie(e.target.value)} required />
      <input type="text" placeholder="Porte" value={porte} onChange={(e) => setPorte(e.target.value)} />
      <input type="text" placeholder="Sexo" value={sexo} onChange={(e) => setSexo(e.target.value)} />
      <input type="number" placeholder="Idade" value={idade} onChange={(e) => setIdade(e.target.value)} />
      <textarea placeholder="Descrição" value={descricao} onChange={(e) => setDescricao(e.target.value)} />
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="Disponível">Disponível</option>
        <option value="Adotado">Adotado</option>
      </select>
      {erro && <p style={{ color: 'red' }}>{erro}</p>}
      <button type="submit">Cadastrar</button>
    </form>
  );
}