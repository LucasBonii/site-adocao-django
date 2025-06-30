import { useEffect, useState } from 'react';
import axios from 'axios';

export default function AnimalList() {
  const [animais, setAnimais] = useState([]);
  const [erro, setErro] = useState('');

  useEffect(() => {
    const fetchAnimais = async () => {
      try {
        const token = localStorage.getItem('access');
        const response = await axios.get('http://localhost:8000/api/animais/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAnimais(response.data);
      } catch (err) {
        setErro('Erro ao buscar animais. Faça login.');
      }
    };

    fetchAnimais();
  }, []);

  return (
    <div>
      <h2>Lista de Animais</h2>
      {erro && <p style={{ color: 'red' }}>{erro}</p>}
      <ul>
        {animais.map((animal) => (
          <li key={animal.id}>
            <strong>{animal.nome}</strong> - {animal.especie} - {animal.status}
          </li>
        ))}
      </ul>
    </div>
  );
}