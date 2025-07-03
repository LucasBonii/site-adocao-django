import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AnimalList() {
  const [animais, setAnimais] = useState([]);
  const [erro, setErro] = useState('');
  const [userTipo, setUserTipo] = useState(null);
  const token = localStorage.getItem('access');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resUser = await axios.get('http://localhost:8000/api/me/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserTipo(resUser.data.tipo);

        const resAnimais = await axios.get('http://localhost:8000/api/animais/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAnimais(resAnimais.data);
      } catch (err) {
        console.error(err);
        setErro('Erro ao carregar dados. Faça login novamente.');
      }
    };

    fetchData();
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

  const editarAnimal = (id) => {
    navigate(`/animais/editar/${id}`);
  };

  const deletarAnimal = async (id) => {
    if (!window.confirm('Tem certeza que deseja deletar este animal?')) return;

    try {
      await axios.delete(`http://localhost:8000/api/animais/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAnimais(animais.filter((animal) => animal.id !== id));
      alert('Animal deletado com sucesso!');
    } catch (err) {
      console.error(err.response?.data);
      alert('Erro ao deletar animal.');
    }
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Animais Disponíveis</h2>
        <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
          Voltar à Dashboard
        </button>
      </div>

      {erro && <div className="alert alert-danger">{erro}</div>}

      <div className="row g-4">
        {animais.length === 0 ? (
          <p className="text-muted">Nenhum animal disponível no momento.</p>
        ) : (
          animais.map((animal) => (
            <div className="col-md-4" key={animal.id}>
              <div className="card h-100 shadow-sm">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{animal.nome}</h5>
                  <p className="card-text mb-1">Espécie: {animal.especie}</p>
                  <p className="card-text mb-2">Status: {animal.status}</p>

                  {userTipo === 'tutor' && (
                    <button
                      className="btn btn-primary mt-auto"
                      onClick={() => candidatar(animal.id)}
                    >
                      Candidatar-se
                    </button>
                  )}

                  {(userTipo === 'admin' || userTipo === 'ong') && (
                    <div className="mt-auto d-flex gap-2">
                      <button className="btn btn-sm btn-outline-primary" onClick={() => editarAnimal(animal.id)}>
                        Editar
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => deletarAnimal(animal.id)}>
                        Excluir
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
