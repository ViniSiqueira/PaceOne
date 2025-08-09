import React, { useState } from 'react';
import toast from 'react-hot-toast';
import './CreateClient.css';

const diasDaSemana = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

const CreateClient = () => {
    const [form, setForm] = useState({
        nome: '',
        cpf: '',
        nascimento: '',
        status: '',
        email: '',
        telefone: '',
        cep: '',
        logradouro: '',
        bairro: '',
        cidade: '',
        complemento: '',
        estado: '',
        diasDeTreino: [],
        modalidade: '',
        plano: '',
        emergenciaNome: '',
        emergenciaTelefone: '',
        limitacaoFisica: '',
        cirurgia: '',
        problemaArticular: '',
        praticaAtividade: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleDiaChange = (dia) => {
        const selecionados = form.diasDeTreino.includes(dia)
            ? form.diasDeTreino.filter(d => d !== dia)
            : [...form.diasDeTreino, dia];

        setForm({ ...form, diasDeTreino: selecionados });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const payload = {
            ...form,
            dias_de_treino: form.diasDeTreino,
        };
        delete payload.diasDeTreino;

        try {
            const response = await fetch('http://localhost:5000/api/clientes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Erro ao salvar cliente');
            }

            const data = await response.json();
            toast.success('Cliente salvo com sucesso!');
            console.log('Cliente salvo:', data.cliente);
            
            setForm({
                nome: '',
                cpf: '',
                nascimento: '',
                status: '',
                email: '',
                telefone: '',
                cep: '',
                logradouro: '',
                bairro: '',
                cidade: '',
                complemento: '',
                estado: '',
                emergencia_nome: '',
                emergencia_telefone: '',
                limitacao_fisica: '',
                cirurgia: '',
                problema_articular: '',
                pratica_atividade: '',
                diasDeTreino: [],
                modalidade: '',
                plano: '',
            });
        } catch (error) {
            toast.error(error.message);
            console.error('Erro ao salvar cliente:', error);
        }
    };

    return (
        <form className="form-container" onSubmit={handleSubmit}>
            <h2>Cadastro de Cliente</h2>
            <input type="text" name="nome" placeholder="Nome completo" value={form.nome} onChange={handleChange} required />
            <input type="text" name="cpf" placeholder="CPF" value={form.cpf} onChange={handleChange} required />
            <input type="date" name="nascimento" value={form.nascimento} onChange={handleChange} required />
            <select name="status" value={form.status} onChange={handleChange} required>
                <option value="">Selecione o status</option>
                <option value="Ativo">Ativo</option>
                <option value="Inativo">Inativo</option>
                <option value="Pendente">Pendente</option>
            </select>
            <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
            <input type="tel" name="telefone" placeholder="Telefone" value={form.telefone} onChange={handleChange} required />
            <input type="text" name="cep" placeholder="CEP" value={form.cep} onChange={handleChange} />
            <input type="text" name="logradouro" placeholder="Logradouro" value={form.logradouro} onChange={handleChange} />
            <input type="text" name="bairro" placeholder="Bairro" value={form.bairro} onChange={handleChange} />
            <input type="text" name="cidade" placeholder="Cidade" value={form.cidade} onChange={handleChange} />
            <input type="text" name="complemento" placeholder="Complemento" value={form.complemento} onChange={handleChange} />
            <input type="text" name="estado" placeholder="Estado" value={form.estado} onChange={handleChange} />
            <input
                type="text"
                name="emergenciaNome"
                placeholder="Nome para contato de emergência"
                value={form.emergenciaNome}
                onChange={handleChange}
            />
            <input
                type="tel"
                name="emergenciaTelefone"
                placeholder="Telefone para contato de emergência"
                value={form.emergenciaTelefone}
                onChange={handleChange}
            />
            <textarea
                name="limitacaoFisica"
                placeholder="Possui alguma limitação física ou lesão atual?"
                value={form.limitacaoFisica}
                onChange={handleChange}
                rows={3}
            />
            <textarea
                name="cirurgia"
                placeholder="Já fez cirurgia? (qual e quando)"
                value={form.cirurgia}
                onChange={handleChange}
                rows={3}
            />
            <textarea
                name="problemaArticular"
                placeholder="Tem algum problema articular ou ósseo que poderia piorar com atividade física?"
                value={form.problemaArticular}
                onChange={handleChange}
                rows={3}
            />
            <textarea
                name="praticaAtividade"
                placeholder="Já pratica ou praticou atividade física? (qual e com que frequência)"
                value={form.praticaAtividade}
                onChange={handleChange}
                rows={3}
            />

            <label>Dias de Treino:</label>
            <div className="dias-container">
                {diasDaSemana.map((dia) => (
                    <label key={dia}>
                        <input
                            type="checkbox"
                            checked={form.diasDeTreino.includes(dia)}
                            onChange={() => handleDiaChange(dia)}
                        />
                        <span>{dia}</span>
                    </label>
                ))}
            </div>

            <select name="modalidade" value={form.modalidade} onChange={handleChange} required>
                <option value="">Selecione a modalidade</option>
                <option value="Musculação">Musculação</option>
                <option value="Crossfit">Crossfit</option>
                <option value="Pilates">Pilates</option>
                <option value="Funcional">Funcional</option>
            </select>

            <select name="plano" value={form.plano} onChange={handleChange} required>
                <option value="">Selecione o plano</option>
                <option value="Mensal">Mensal</option>
                <option value="Trimestral">Trimestral</option>
                <option value="Semestral">Semestral</option>
                <option value="Anual">Anual</option>
            </select>

            <button type="submit">Cadastrar</button>
        </form>
    );
};

export default CreateClient;
