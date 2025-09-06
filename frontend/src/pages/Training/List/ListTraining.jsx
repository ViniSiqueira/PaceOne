import React, { useEffect, useState } from 'react';
import './ListTraining.css';
import { useNavigate } from 'react-router-dom';
import { API_BACKEND_URL } from '../../../constants/url';

const ListTraining = () => {
    const navigate = useNavigate();
    const [treinos, setTreinos] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleCreateTreino = () => {
        navigate('/CreateTraining');
    };

    const fetchTreinos = async () => {
        try {
            const response = await fetch(`${API_BACKEND_URL}/api/treinos`);
            if (!response.ok) throw new Error('Erro ao buscar treinos');
            const data = await response.json();
            setTreinos(data);
        } catch (error) {
            console.error(error);
            setTreinos([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTreinos();
    }, []);

    const handleEditTreino = (treino) => {
        navigate('/CreateTraining', { state: { treino } });
    };

    return (
        <div className="container-list-treinos">
            <div className="header-actions">
                <button className="btn-new-treino" onClick={handleCreateTreino}>
                    + Novo treino
                </button>
            </div>

            {loading ? (
                <p>Carregando treinos...</p>
            ) : (
                <table className="treinos-table">
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>Cliente</th>
                            <th>Intensidade</th>
                            <th>Tempo</th>
                            <th>Tipo</th>
                            <th>Descrição</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {treinos.length === 0 ? (
                            <tr>
                                <td colSpan="7" style={{ textAlign: 'center' }}>Nenhum treino encontrado.</td>
                            </tr>
                        ) : (
                            treinos.map((treino) => (
                                <tr key={treino.id}>
                                    <td onClick={() => handleEditTreino(treino)} style={{ cursor: 'pointer' }}>{treino.id}</td>
                                    <td onClick={() => handleEditTreino(treino)} style={{ cursor: 'pointer' }}>{treino.cliente_nome}</td>
                                    <td onClick={() => handleEditTreino(treino)} style={{ cursor: 'pointer' }}>{treino.intensidade}</td>
                                    <td onClick={() => handleEditTreino(treino)} style={{ cursor: 'pointer' }}>{treino.tempo_treino}</td>
                                    <td onClick={() => handleEditTreino(treino)} style={{ cursor: 'pointer' }}>{treino.tipo_treino}</td>
                                    <td onClick={() => handleEditTreino(treino)} style={{ cursor: 'pointer' }}>{treino.descricao}</td>
                                    <td>
                                        <button className="btn-delete" onClick={async () => {
                                            if (window.confirm('Deseja realmente excluir este treino?')) {
                                                try {
                                                    const res = await fetch(`${API_BACKEND_URL}/api/treinos/${treino.id}`, { method: 'DELETE' });
                                                    if (!res.ok) throw new Error('Erro ao excluir treino');
                                                    setTreinos(treinos.filter(t => t.id !== treino.id));
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

export default ListTraining;
