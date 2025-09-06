import React, { useEffect, useState } from 'react';
import './Financeiro.css';

const toYYYYMMDD = (v) => (v ? new Date(v).toISOString().slice(0, 10) : '');

export default function ModalTitulo({ modo = 'criar', tipo = 'pagar', initial = null, onClose, onSalvar }) {
  const isPagar = tipo === 'pagar';
  const [form, setForm] = useState({
    descricao: '', valor: '', vencimento: '',
    juros: 0, acrescimo: 0, desconto: 0, status: 'Aberto',
    data_pagamento: '', data_recebimento: '',
  });

  useEffect(() => {
    if (initial) {
      setForm({
        descricao: initial.descricao || '',
        valor: initial.valor ?? '',
        vencimento: toYYYYMMDD(initial.vencimento),
        juros: initial.juros ?? 0,
        acrescimo: initial.acrescimo ?? 0,
        desconto: initial.desconto ?? 0,
        status: initial.status || 'Aberto',
        data_pagamento: toYYYYMMDD(initial.data_pagamento),
        data_recebimento: toYYYYMMDD(initial.data_recebimento),
      });
    } else {
      setForm((f) => ({ ...f, vencimento: toYYYYMMDD(new Date()) }));
    }
  }, [initial]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.descricao || !form.vencimento || form.valor === '') return;
    const payload = {
      descricao: form.descricao,
      valor: Number(form.valor),
      vencimento: form.vencimento,
      juros: Number(form.juros || 0),
      acrescimo: Number(form.acrescimo || 0),
      desconto: Number(form.desconto || 0),
      status: form.status,
      ...(isPagar ? { data_pagamento: form.data_pagamento || null }
                  : { data_recebimento: form.data_recebimento || null }),
    };
    onSalvar(payload);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{modo === 'criar' ? `Novo título - ${isPagar ? 'A Pagar' : 'A Receber'}` : 'Editar título'}</h3>
          <button className="icon-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid-2">
            <label>
              Descrição*
              <input type="text" value={form.descricao}
                     onChange={(e) => setForm({ ...form, descricao: e.target.value })} required />
            </label>

            <label>
              Valor*
              <input type="number" step="0.01" inputMode="decimal" value={form.valor}
                     onChange={(e) => setForm({ ...form, valor: e.target.value })} required />
            </label>

            <label>
              Vencimento*
              <input type="date" value={form.vencimento}
                     onChange={(e) => setForm({ ...form, vencimento: e.target.value })} required />
            </label>

            <label>
              Status
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                {isPagar ? (
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
            </label>

            <label>
              Juros
              <input type="number" step="0.01" inputMode="decimal"
                     value={form.juros} onChange={(e) => setForm({ ...form, juros: e.target.value })} />
            </label>

            <label>
              Acréscimo
              <input type="number" step="0.01" inputMode="decimal"
                     value={form.acrescimo} onChange={(e) => setForm({ ...form, acrescimo: e.target.value })} />
            </label>

            <label>
              Desconto
              <input type="number" step="0.01" inputMode="decimal"
                     value={form.desconto} onChange={(e) => setForm({ ...form, desconto: e.target.value })} />
            </label>

            {isPagar ? (
              <label>
                Data de pagamento
                <input type="date" value={form.data_pagamento}
                       onChange={(e) => setForm({ ...form, data_pagamento: e.target.value })} />
              </label>
            ) : (
              <label>
                Data de recebimento
                <input type="date" value={form.data_recebimento}
                       onChange={(e) => setForm({ ...form, data_recebimento: e.target.value })} />
              </label>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-outline" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-primary">{modo === 'criar' ? 'Salvar' : 'Atualizar'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
