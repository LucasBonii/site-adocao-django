import { useEffect, useState } from 'react';
import axios from 'axios';

export default function AnimalList() {
  const [animais, setAnimais] = useState([]);
  const [erro, setErro] = useState('');
  const token = localStorage.getItem('access');

  useEffect(() => {
    const fetchAnimais = async () => {
      try {
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
  }, [token]);

  const candidatar = async (animalId) => {
    const justificativa = window.prompt('Por que deseja adotar este animal?');
    if (!justificativa) return;

    try {
      await axios.post(
        'http://localhost:8000/api/candidaturas/',
        { animal: animalId, justificativa },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('Candidatura enviada com sucesso!');
    } catch (err) {
      console.error(err.response?.data);
      alert('Erro ao enviar candidatura.');
    }
  };

  return (
    <div>
      <h2>Lista de Animais</h2>
      {erro && <p style={{ color: 'red' }}>{erro}</p>}
      <ul>
        {animais.map((animal) => (
          <li key={animal.id}>
            <strong>{animal.nome}</strong> - {animal.especie} - {animal.status}
            <button onClick={() => candidatar(animal.id)}>Candidatar-se</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
