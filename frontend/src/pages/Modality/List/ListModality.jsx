import React, { useEffect, useState } from 'react';
import './ListModality.css';
import { useNavigate } from 'react-router-dom';
import { API_BACKEND_URL } from '../../../constants/url';
import * as FaIcons from 'react-icons/fa';

const ListModality = () => {
    const navigate = useNavigate();
    const [modalitys, setModalitys] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleCreateModality = () => {
        navigate('/createModality');
    };

    useEffect(() => {
        const fetchModality = async () => {
            try {
                const response = await fetch(`${API_BACKEND_URL}/api/modalidades`);
                if (!response.ok) throw new Error('Erro ao buscar modalidades');
                const data = await response.json();
                setModalitys(data);
            } catch (error) {
                console.error(error);
                setModalitys([]);
            } finally {
                setLoading(false);
            }
        };

        fetchModality();
    }, []);

    const handleEditModality = (modality) => {
        navigate('/createModality', { state: { modality } });
    };

    return (
        <div className="container-list-modality">
            <div className="header-actions">
                <button className="btn-new-modality" onClick={handleCreateModality}>
                    + Nova modalidade
                </button>
            </div>

            {loading ? (
                <p>Carregando modalidades...</p>
            ) : (
                <table className="modality-table">
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>Descrição</th>
                            <th>Ícone</th>                            
                            <th>Cor do Ícone</th>
                        </tr>
                    </thead>
                    <tbody>
                        {modalitys.length === 0 ? (
                            <tr>
                                <td colSpan="4" style={{ textAlign: 'center' }}>
                                    Nenhuma modalidade encontrada.
                                </td>
                            </tr>
                        ) : (
                            modalitys.map((modality) => (
                                <tr
                                    key={modality.id}
                                    onClick={() => handleEditModality(modality)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <td>{modality.id}</td>
                                    <td>{modality.descricao}</td>
                                    <td>
                                        <span style={{ fontSize: '1.5rem', color: modality.cor_icon || '#000' }}>
                                            {FaIcons[modality.icone] ? React.createElement(FaIcons[modality.icone]) : null}
                                        </span>
                                    </td>                                    
                                    <td>
                                        <span
                                            style={{
                                                backgroundColor: modality.cor_icon,
                                                display: 'inline-block',
                                                width: '20px',
                                                height: '20px',
                                                borderRadius: '50%'
                                            }}
                                        />
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

export default ListModality;
