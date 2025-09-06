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

    const handleEditClient = (client) => {
        navigate('/createClient', { state: { client } });
    };

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
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.length === 0 ? (
                            <tr>
                                <td colSpan="10" style={{ textAlign: 'center' }}>
                                    Nenhum cliente encontrado.
                                </td>
                            </tr>
                        ) : (
                            clients.map((client) => (
                                <tr key={client.id}>
                                    <td onClick={() => handleEditClient(client)} style={{ cursor: 'pointer' }}>{client.id}</td>
                                    <td onClick={() => handleEditClient(client)} style={{ cursor: 'pointer' }}></td>
                                    <td onClick={() => handleEditClient(client)} style={{ cursor: 'pointer' }}>{client.nome}</td>
                                    <td onClick={() => handleEditClient(client)} style={{ cursor: 'pointer' }}>{new Date(client.nascimento).toLocaleDateString()}</td>
                                    <td onClick={() => handleEditClient(client)} style={{ cursor: 'pointer' }}>{client.email}</td>
                                    <td onClick={() => handleEditClient(client)} style={{ cursor: 'pointer' }}>{client.telefone}</td>
                                    <td onClick={() => handleEditClient(client)} style={{ cursor: 'pointer' }}>{client.plano}</td>
                                    <td onClick={() => handleEditClient(client)} style={{ cursor: 'pointer' }}>{client.modalidade}</td>
                                    <td onClick={() => handleEditClient(client)} style={{ cursor: 'pointer' }}>{client.dias_de_treino?.join(', ')}</td>
                                    <td>
                                        <button className="btn-delete" onClick={async () => {
                                            if (window.confirm('Deseja realmente excluir este cliente?')) {
                                                try {
                                                    const res = await fetch(`${API_BACKEND_URL}/api/clientes/${client.id}`, { method: 'DELETE' });
                                                    if (!res.ok) throw new Error('Erro ao excluir cliente');
                                                    setClients(clients.filter(c => c.id !== client.id));
                                                } catch (err) {
                                                    console.error(err);
                                                    alert(err.message);
                                                }
                                            }
                                        }}>Excluir</button>
                                    </td>
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
