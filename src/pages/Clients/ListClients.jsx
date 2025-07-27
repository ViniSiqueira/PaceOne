import React from 'react';
import './ListClients.css';

const ListClients = () => {
    return (
        <div className="container-list-clients">
            <div className="header-actions">
                <button className="btn-new-client">+ Novo cliente</button>
            </div>

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

                </tbody>
            </table>
        </div>
    );
};

export default ListClients;
