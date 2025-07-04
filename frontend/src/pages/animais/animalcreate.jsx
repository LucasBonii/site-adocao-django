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
  const [status, setStatus] = useState('disponivel');
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
        idade: Number(idade),
        descricao,
        status,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Animal cadastrado com sucesso!');
      navigate('/animais');
    } catch (err) {
      console.error(err);
      setErro('Erro ao cadastrar animal. Verifique os dados.');
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '600px' }}>
      <h2 className="text-center mb-4">Cadastrar Animal</h2>
      {erro && <div className="alert alert-danger">{erro}</div>}

      <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
        <input
          type="text"
          className="form-control"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
        <input
          type="text"
          className="form-control"
          placeholder="Espécie"
          value={especie}
          onChange={(e) => setEspecie(e.target.value)}
          required
        />
        <input
          type="text"
          className="form-control"
          placeholder="Porte"
          value={porte}
          onChange={(e) => setPorte(e.target.value)}
        />
        <select
          className="form-control"
          value={sexo}
          onChange={(e) => setSexo(e.target.value)}
          required
        >
          <option value="">Sexo</option>
          <option value="M">Macho</option>
          <option value="F">Fêmea</option>
        </select>
        <input
          type="number"
          className="form-control"
          placeholder="Idade"
          value={idade}
          onChange={(e) => setIdade(e.target.value)}
        />
        <textarea
          className="form-control"
          placeholder="Descrição"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />
        <select
          className="form-select"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="disponivel">Disponível</option>
          <option value="indisponivel">Indisponível</option>
        </select>

        <div className="d-flex justify-content-between mt-3">
          <button className="btn btn-secondary" type="button" onClick={() => navigate('/dashboard')}>
            Voltar
          </button>
          <button className="btn btn-primary" type="submit">
            Cadastrar
          </button>
        </div>
      </form>
    </div>
  );
}
