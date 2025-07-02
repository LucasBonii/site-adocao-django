// src/pages/Visitas.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Visitas() {
  const [tutorNome, setTutorNome] = useState('');
  const [animalNome, setAnimalNome] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [visitas, setVisitas] = useState([]);
  const token = localStorage.getItem('access');

  const fetchVisitas = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/visitas/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVisitas(res.data);
    } catch (err) {
      console.error('Erro ao buscar visitas:', err);
    }
  };

  useEffect(() => {
    fetchVisitas();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        'http://localhost:8000/api/visitas/',
        { tutor_nome: tutorNome, animal_nome: animalNome, observacoes },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTutorNome('');
      setAnimalNome('');
      setObservacoes('');
      fetchVisitas();
    } catch (err) {
      console.error('Erro ao registrar visita:', err);
    }
  };

  return (
    <div>
      <h2>Registrar Visita</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nome do Tutor"
          value={tutorNome}
          onChange={(e) => setTutorNome(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Nome do Animal"
          value={animalNome}
          onChange={(e) => setAnimalNome(e.target.value)}
          required
        />
        <textarea
          placeholder="Observações"
          value={observacoes}
          onChange={(e) => setObservacoes(e.target.value)}
        />
        <button type="submit">Registrar</button>
      </form>

      <h2>Visitas Registradas</h2>
      <ul>
        {visitas.map((v, index) => (
          <li key={index}>
            <strong>{v.tutor_nome}</strong> visitou <strong>{v.animal_nome}</strong> em {v.data || 'Data não disponível'}
            <br />Observações: {v.observacoes || 'Sem observações'}
          </li>
        ))}
      </ul>
    </div>
  );
}