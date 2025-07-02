import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Candidaturas() {
  const [candidaturas, setCandidaturas] = useState([]);
  const [userTipo, setUserTipo] = useState('');

  // Buscar tipo do usuário e candidaturas ao carregar a página
  useEffect(() => {
    const token = localStorage.getItem('access');

    // Busca o tipo de usuário (ong, tutor, admin)
    axios.get('http://localhost:8000/api/me/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(res => {
      setUserTipo(res.data.tipo);
    });

    // Busca todas as candidaturas visíveis para o usuário
    axios.get('http://localhost:8000/api/candidaturas/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(res => {
      setCandidaturas(res.data);
    }).catch(err => console.error(err));
  }, []);

  // Função para aprovar uma candidatura
  const aprovarCandidatura = (id) => {
    const token = localStorage.getItem('access');

    axios.patch(`http://localhost:8000/api/candidaturas/${id}/aprovar/`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(() => {
      // Atualiza a lista localmente
      setCandidaturas(prev =>
        prev.map(c => c.id === id ? { ...c, status: 'aprovada' } : c)
      );
    }).catch(() => alert('Erro ao aprovar.'));
  };

  // Função para rejeitar uma candidatura
  const rejeitarCandidatura = (id) => {
    const token = localStorage.getItem('access');

    axios.patch(`http://localhost:8000/api/candidaturas/${id}/rejeitar/`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(() => {
      setCandidaturas(prev =>
        prev.map(c => c.id === id ? { ...c, status: 'rejeitada' } : c)
      );
    }).catch(() => alert('Erro ao rejeitar.'));
  };

  return (
    <div>
      <h1>Minhas Candidaturas</h1>

      {candidaturas.length === 0 ? (
        <p>Nenhuma candidatura encontrada.</p>
      ) : (
        <ul>
          {candidaturas.map((c) => (
            <li key={c.id} style={{ marginBottom: '10px' }}>
              {userTipo === 'tutor' && (
                <>
                  <strong>Animal:</strong> {c.animal.nome} |
                  <strong> Data:</strong> {c.data_candidatura} |
                  <strong> Status:</strong> {c.status}
                </>
              )}

              {userTipo === 'ong' && (
                <>
                  <strong>Adotante:</strong> {c.adotante.username} |
                  <strong> Animal:</strong> {c.animal.nome} |
                  <strong> Data:</strong> {c.data_candidatura} |
                  <strong> Status:</strong> {c.status}

                  {/* Botões de ação apenas se pendente */}
                  {c.status === 'pendente' && (
                    <>
                      <button onClick={() => aprovarCandidatura(c.id)} style={{ marginLeft: '10px' }}>
                        Aprovar
                      </button>
                      <button onClick={() => rejeitarCandidatura(c.id)} style={{ marginLeft: '5px' }}>
                        Rejeitar
                      </button>
                    </>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
