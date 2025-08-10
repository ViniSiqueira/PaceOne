import React, { useState } from 'react';
import toast from 'react-hot-toast';
import './CreateClient.css';
import { API_BACKEND_URL } from '../../../constants/url';
import { useLocation, useNavigate } from 'react-router-dom';

const diasDaSemana = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

const CreateClient = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const clienteParaEditar = location.state?.client;
    const [form, setForm] = useState(() => {
        if (clienteParaEditar) {
            return {
                id: clienteParaEditar.id || '',
                nome: clienteParaEditar.nome || '',
                cpf: clienteParaEditar.cpf || '',
                nascimento: clienteParaEditar.nascimento
                    ? clienteParaEditar.nascimento.split('T')[0]
                    : '',
                status: clienteParaEditar.status || '',
                email: clienteParaEditar.email || '',
                telefone: clienteParaEditar.telefone || '',
                cep: clienteParaEditar.cep || '',
                logradouro: clienteParaEditar.logradouro || '',
                bairro: clienteParaEditar.bairro || '',
                cidade: clienteParaEditar.cidade || '',
                complemento: clienteParaEditar.complemento || '',
                estado: clienteParaEditar.estado || '',
                emergencia_nome: clienteParaEditar.emergencia_nome || '',
                emergencia_telefone: clienteParaEditar.emergencia_telefone || '',
                limitacao_fisica: clienteParaEditar.limitacao_fisica || '',
                cirurgia: clienteParaEditar.cirurgia || '',
                problema_articular: clienteParaEditar.problema_articular || '',
                pratica_atividade: clienteParaEditar.pratica_atividade || '',
                dias_de_treino: clienteParaEditar.dias_de_treino || [],
                modalidade: clienteParaEditar.modalidade || '',
                plano: clienteParaEditar.plano || '',
            };
        }
        return {
            id: '',
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
            dias_de_treino: [],
            modalidade: '',
            plano: '',
        };
    });


    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleDiaChange = (dia) => {
        const selecionados = form.dias_de_treino.includes(dia)
            ? form.dias_de_treino.filter(d => d !== dia)
            : [...form.dias_de_treino, dia];

        setForm({ ...form, dias_de_treino: selecionados });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            ...form,
            dias_de_treino: form.dias_de_treino,
        };
        delete payload.dias_de_treino;

        const method = payload.id ? 'PUT' : 'POST';
        const url = payload.id
            ? `${API_BACKEND_URL}/api/clientes/${payload.id}`
            : `${API_BACKEND_URL}/api/clientes`;


        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Erro ao salvar cliente');
            }

            toast.success('Cliente salvo com sucesso!');
            navigate('/listClients');

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
                dias_de_treino: [],
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
                name="emergencia_nome"
                placeholder="Nome para contato de emergência"
                value={form.emergencia_nome}
                onChange={handleChange}
            />
            <input
                type="tel"
                name="emergencia_telefone"
                placeholder="Telefone para contato de emergência"
                value={form.emergencia_telefone}
                onChange={handleChange}
            />
            <textarea
                name="limitacao_fisica"
                placeholder="Possui alguma limitação física ou lesão atual?"
                value={form.limitacao_fisica}
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
                name="problema_articular"
                placeholder="Tem algum problema articular ou ósseo que poderia piorar com atividade física?"
                value={form.problema_articular}
                onChange={handleChange}
                rows={3}
            />
            <textarea
                name="pratica_atividade"
                placeholder="Já pratica ou praticou atividade física? (qual e com que frequência)"
                value={form.pratica_atividade}
                onChange={handleChange}
                rows={3}
            />

            <label>Dias de Treino:</label>
            <div className="dias-container">
                {diasDaSemana.map((dia) => (
                    <label key={dia}>
                        <input
                            type="checkbox"
                            checked={form.dias_de_treino.includes(dia)}
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
