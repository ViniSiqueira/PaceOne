import React, { useEffect, useState } from 'react';
import './ListClients.css';
import { useNavigate } from 'react-router-dom';
import { API_BACKEND_URL } from '../../../constants/url';

const ListClients = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleCreateClient = () => {
    navigate('/createClient');
  };

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch(`${API_BACKEND_URL}/api/clientes`);
        if (!response.ok) throw new Error('Erro ao buscar clientes');
        const data = await response.json();
        setClients(data);
      } catch (error) {
        console.error(error);
        setClients([]);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  return (
    <div className="container-list-clients">
      <div className="header-actions">
        <button className="btn-new-client" onClick={handleCreateClient}>
          + Novo cliente
        </button>
      </div>

      {loading ? (
        <p>Carregando clientes...</p>
      ) : (
        <table className="clients-table">
          <thead>
            <tr>
              <th>Código</th>
              <th></th>
              <th>Nome</th>
              <th>Data de nascimento</th>
              <th>E-mail</th>
              <th>Telefone</th>
              <th>Plano</th>
              <th>Modalidade</th>
              <th>Dias de treino</th>
            </tr>
          </thead>
          <tbody>
            {clients.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center' }}>
                  Nenhum cliente encontrado.
                </td>
              </tr>
            ) : (
              clients.map((client) => (
                <tr key={client.id}>
                  <td>{client.id}</td>
                  <td></td>
                  <td>{client.nome}</td>
                  <td>{new Date(client.nascimento).toLocaleDateString()}</td>
                  <td>{client.email}</td>
                  <td>{client.telefone}</td>
                  <td>{client.plano}</td>
                  <td>{client.modalidade}</td>
                  <td>{client.dias_de_treino?.join(', ')}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ListClients;
