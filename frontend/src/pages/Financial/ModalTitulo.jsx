import React, { useState } from 'react';
import './Financeiro.css';

const ModalTitulo = ({ onClose, onSalvar, tipo }) => {
    const [form, setForm] = useState({
        descricao: '',
        vencimento: '',
        data_pagamento: '',
        data_recebimento: '',
        valor: '',
        juros: '',
        acrescimo: '',
        desconto: '',
        status: 'Aberto',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSalvar(form);
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Novo Título</h3>
                <form onSubmit={handleSubmit} className="form-titulo">
                    <input name="descricao" placeholder="Descrição" value={form.descricao} onChange={handleChange} required />
                    <input type="date" name="vencimento" value={form.vencimento} onChange={handleChange} required />
                    {tipo === 'pagar'
                        ? <input type="date" name="data_pagamento" placeholder="Data Pagamento" value={form.data_pagamento} onChange={handleChange} />
                        : <input type="date" name="data_recebimento" placeholder="Data Recebimento" value={form.data_recebimento} onChange={handleChange} />}
                    <input type="number" name="valor" step="0.01" placeholder="Valor" value={form.valor} onChange={handleChange} required />
                    <input type="number" name="juros" step="0.01" placeholder="Juros" value={form.juros} onChange={handleChange} />
                    <input type="number" name="acrescimo" step="0.01" placeholder="Acréscimo" value={form.acrescimo} onChange={handleChange} />
                    <input type="number" name="desconto" step="0.01" placeholder="Desconto" value={form.desconto} onChange={handleChange} />
                    <select name="status" value={form.status} onChange={handleChange}>
                        {tipo === 'pagar' ? (
                            <>
                                <option value="Aberto">Aberto</option>
                                <option value="Pago">Pago</option>
                            </>
                        ) : (
                            <>
                                <option value="Aberto">Aberto</option>
                                <option value="Recebido">Recebido</option>
                            </>
                        )}
                    </select>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                        <button type="submit">Salvar</button>
                        <button type="button" onClick={onClose} style={{ background: '#f44336' }}>Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModalTitulo;
