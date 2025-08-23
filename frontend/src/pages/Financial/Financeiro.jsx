import React, { useEffect, useState } from 'react';
import './Financeiro.css';
import { API_BACKEND_URL } from '../../constants/url';

const Financeiro = () => {
    const [contasPagar, setContasPagar] = useState([]);
    const [contasReceber, setContasReceber] = useState([]);
    const [loading, setLoading] = useState(true);

    // Totais
    const totalPagar = contasPagar.reduce((acc, c) => acc + parseFloat(c.valor || 0), 0);
    const totalReceber = contasReceber.reduce((acc, c) => acc + parseFloat(c.valor || 0), 0);
    const saldo = totalReceber - totalPagar;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [pagarRes, receberRes] = await Promise.all([
                    fetch(`${API_BACKEND_URL}/api/contasPagar`),
                    fetch(`${API_BACKEND_URL}/api/contasReceber`)
                ]);

                const pagarData = await pagarRes.json();
                const receberData = await receberRes.json();

                setContasPagar(pagarData);
                setContasReceber(receberData);
            } catch (error) {
                console.error('Erro ao buscar dados financeiros:', error);
                setContasPagar([]);
                setContasReceber([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="financeiro-container">
            <h2>Financeiro</h2>

            {/* Cards de resumo */}
            <div className="financeiro-resumo">
                <div className="card resumo-pagar">
                    <h3>Total a Pagar</h3>
                    <p>R$ {totalPagar.toFixed(2)}</p>
                </div>
                <div className="card resumo-receber">
                    <h3>Total a Receber</h3>
                    <p>R$ {totalReceber.toFixed(2)}</p>
                </div>
                <div className="card resumo-saldo">
                    <h3>Saldo</h3>
                    <p>R$ {saldo.toFixed(2)}</p>
                </div>
            </div>

            {loading ? (
                <p>Carregando dados financeiros...</p>
            ) : (
                <>
                    {/* Contas a Pagar */}
                    <h3>Contas a Pagar</h3>
                    <table className="financeiro-table">
                        <thead>
                            <tr>
                                <th>Descrição</th>
                                <th>Valor</th>
                                <th>Data de Vencimento</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contasPagar.length === 0 ? (
                                <tr><td colSpan="4">Nenhuma conta a pagar.</td></tr>
                            ) : (
                                contasPagar.map(c => (
                                    <tr key={c.id}>
                                        <td>{c.descricao}</td>
                                        <td>R$ {parseFloat(c.valor).toFixed(2)}</td>
                                        <td>{new Date(c.vencimento).toLocaleDateString()}</td>
                                        <td>{c.status}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    {/* Contas a Receber */}
                    <h3>Contas a Receber</h3>
                    <table className="financeiro-table">
                        <thead>
                            <tr>
                                <th>Descrição</th>
                                <th>Valor</th>
                                <th>Data de Recebimento</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contasReceber.length === 0 ? (
                                <tr><td colSpan="4">Nenhuma conta a receber.</td></tr>
                            ) : (
                                contasReceber.map(c => (
                                    <tr key={c.id}>
                                        <td>{c.descricao}</td>
                                        <td>R$ {parseFloat(c.valor).toFixed(2)}</td>
                                        <td>{new Date(c.dataRecebimento).toLocaleDateString()}</td>
                                        <td>{c.status}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
};

export default Financeiro;
