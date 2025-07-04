import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Visitas() {
  const [visitas, setVisitas] = useState([]);
  const [userTipo, setUserTipo] = useState(null);
  const [modoEdicao, setModoEdicao] = useState(null); 
  const [formData, setFormData] = useState({
    tutor_nome: '',
    animal_nome: '',
    observacoes: '',
    data: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Ongs';
  }, []);


  useEffect(() => {
    const token = localStorage.getItem('access');

    async function fetchData() {
      try {
        const resUser = await axios.get('http://localhost:8000/api/me/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserTipo(resUser.data.tipo);

        const resVisitas = await axios.get('http://localhost:8000/api/visitas/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setVisitas(resVisitas.data);
      } catch (err) {
        console.error(err);
        navigate('/dashboard');
      }
    }
    fetchData();
  }, [navigate]);


  const iniciarEdicao = (visita) => {
    setModoEdicao(visita);
    setFormData({
      tutor_nome: visita.tutor_nome,
      animal_nome: visita.animal_nome,
      observacoes: visita.observacoes || '',
      data: visita.data
    });
  };

  const cancelarEdicao = () => {
    setModoEdicao(null);
    setFormData({ tutor_nome: '', animal_nome: '', observacoes: '', data: '' });
  };

  const salvarEdicao = async () => {
    const token = localStorage.getItem('access');
    try {
      await axios.put('http://localhost:8000/api/visitas/', {
        tutor_nome_antigo: modoEdicao.tutor_nome,
        animal_nome_antigo: modoEdicao.animal_nome,
        data_antiga: modoEdicao.data,
        ...formData
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const novasVisitas = visitas.map((v) =>
        v === modoEdicao ? { ...formData } : v
      );
      setVisitas(novasVisitas);
      cancelarEdicao();
      alert('Visita editada com sucesso!');
    } catch (err) {
      console.error(err);
      alert('Erro ao editar visita.');
    }
  };

  const deletarVisita = async (visita) => {
    if (!window.confirm('Tem certeza que deseja deletar esta visita?')) return;

    const token = localStorage.getItem('access');
    try {
      await axios.delete('http://localhost:8000/api/visitas/', {
        headers: { Authorization: `Bearer ${token}` },
        data: {
          tutor_nome: visita.tutor_nome,
          animal_nome: visita.animal_nome,
          data: visita.data
        }
      });

      setVisitas(visitas.filter((v) => v !== visita));
      alert('Visita deletada com sucesso!');
    } catch (err) {
      console.error(err);
      alert('Erro ao deletar visita.');
    }
  };

  const salvarNovaVisita = async () => {
    const token = localStorage.getItem('access');

    if (!formData.tutor_nome || !formData.animal_nome || !formData.data) {
      alert('Preencha tutor, animal e data');
      return;
    }

    try {
      const res = await axios.post('http://localhost:8000/api/visitas/', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setVisitas([...visitas, res.data]);
      cancelarEdicao();
      alert('Visita cadastrada com sucesso!');
    } catch (err) {
      console.error(err);
      alert('Erro ao cadastrar visita.');
    }
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Minhas Visitas</h1>
        <div>
          <button className="btn btn-success me-2" onClick={() => setModoEdicao('novo')}>
            Nova Visita
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
            Voltar à Dashboard
          </button>
        </div>
      </div>

      {modoEdicao === 'novo' && (
        <div className="card p-3 mb-4">
          <h5>Nova Visita</h5>
          <input
            className="form-control mb-2"
            value={formData.tutor_nome}
            onChange={(e) => setFormData({ ...formData, tutor_nome: e.target.value })}
            placeholder="Tutor"
          />
          <input
            className="form-control mb-2"
            value={formData.animal_nome}
            onChange={(e) => setFormData({ ...formData, animal_nome: e.target.value })}
            placeholder="Animal"
          />
          <input
            type="date"
            className="form-control mb-2"
            value={formData.data}
            onChange={(e) => setFormData({ ...formData, data: e.target.value })}
            placeholder="Data"
          />
          <textarea
            className="form-control mb-2"
            value={formData.observacoes}
            onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
            placeholder="Observações"
          />
          <div className="d-flex gap-2">
            <button className="btn btn-success btn-sm" onClick={salvarNovaVisita}>
              Salvar
            </button>
            <button className="btn btn-secondary btn-sm" onClick={cancelarEdicao}>
              Cancelar
            </button>
          </div>
        </div>
      )}


      {visitas.length === 0 ? (
        <p>Nenhuma visita encontrada.</p>
      ) : (
        <ul className="list-group">
          {visitas.map((v) => (
            <li
              key={`${v.tutor_nome}-${v.animal_nome}-${v.data}`}
              className="list-group-item"
            >
              {modoEdicao === v ? (
                <div>
                  <input
                    className="form-control mb-2"
                    value={formData.tutor_nome}
                    onChange={(e) => setFormData({ ...formData, tutor_nome: e.target.value })}
                    placeholder="Tutor"
                  />
                  <input
                    className="form-control mb-2"
                    value={formData.animal_nome}
                    onChange={(e) => setFormData({ ...formData, animal_nome: e.target.value })}
                    placeholder="Animal"
                  />
                  <input
                    className="form-control mb-2"
                    value={formData.data}
                    onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                    placeholder="Data"
                  />
                  <textarea
                    className="form-control mb-2"
                    value={formData.observacoes}
                    onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                    placeholder="Observações"
                  ></textarea>
                  <div className="d-flex gap-2">
                    <button className="btn btn-success btn-sm" onClick={salvarEdicao}>Salvar</button>
                    <button className="btn btn-secondary btn-sm" onClick={cancelarEdicao}>Cancelar</button>
                  </div>
                </div>
              ) : (
                <div className="d-flex justify-content-between flex-column flex-md-row">
                  <div>
                    <strong>{v.tutor_nome}</strong> visitou <strong>{v.animal_nome}</strong> em <em>{v.data}</em>
                    {v.observacoes && (
                      <>
                        <br /><small>Obs: {v.observacoes}</small>
                      </>
                    )}
                  </div>
                  {(userTipo === 'admin' || userTipo === 'ong') && (
                    <div className="mt-2 mt-md-0 d-flex gap-2">
                      <button className="btn btn-sm btn-outline-primary" onClick={() => iniciarEdicao(v)}>
                        Editar
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => deletarVisita(v)}>
                        Excluir
                      </button>
                    </div>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
