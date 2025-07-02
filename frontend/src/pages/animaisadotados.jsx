import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AnimaisAdotados() {
  const [animais, setAnimais] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('access');

    axios.get('http://localhost:8000/api/meus-animais-adotados/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(res => {
      setAnimais(res.data);
    }).catch(err => {
      console.error(err);
      alert('Erro ao carregar seus animais adotados');
    });
  }, []);

  if (animais.length === 0) return <p>Você ainda não adotou nenhum animal.</p>;

  return (
    <div>
      <h1>Meus Animais Adotados</h1>
      <ul>
        {animais.map(a => (
          <li key={a.id}>
            <strong>{a.nome}</strong> - {a.especie} - {a.porte} - {a.idade} anos
            <br />
            Desde: {a.data_inicio_responsabilidade}
            <br />
            Observações: {a.observacoes || 'Nenhuma'}
          </li>
        ))}
      </ul>
    </div>
  );
}
