import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import './CreateTraining.css';
import { API_BACKEND_URL } from '../../../constants/url';
import { useLocation, useNavigate } from 'react-router-dom';

const CreateTraining = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const trainingToEdit = location.state?.treino;
    const [clients, setClients] = useState([]);
    const isEdit = Boolean(trainingToEdit?.id);
    const [form, setForm] = useState(() => ({
        id: trainingToEdit?.id || '',
        intensidade: trainingToEdit?.intensidade || '',
        tempo_treino: trainingToEdit?.tempo_treino || '',
        tipo_treino: trainingToEdit?.tipo_treino || '',
        descricao: trainingToEdit?.descricao || '',
        cliente_id: trainingToEdit?.cliente_id || '',
    }));

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await fetch(`${API_BACKEND_URL}/api/clientes`);
                if (!response.ok) throw new Error('Erro ao buscar clientes');
                const data = await response.json();
                setClients(data);
            } catch (error) {
                console.error(error);
                toast.error('Erro ao carregar clientes');
            }
        };

        fetchClients();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {            
            const { id, ...body } = form;

            const url = isEdit
                ? `${API_BACKEND_URL}/api/treinos/${form.id}`
                : `${API_BACKEND_URL}/api/treinos`;

            const method = isEdit ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Erro ao salvar treino');
            }

            toast.success(isEdit ? 'Treino atualizado com sucesso!' : 'Treino salvo com sucesso!');
            
            navigate('/listTraining');

            if (!isEdit) {
                setForm({
                    id: '',
                    cliente_id: '',
                    intensidade: '',
                    tempo_treino: '',
                    tipo_treino: '',
                    descricao: '',
                });
            }
        } catch (error) {
            toast.error(error.message);
            console.error('Erro ao salvar/atualizar treino:', error);
        }
    };


    return (
        <form className="form-container" onSubmit={handleSubmit}>
            <h2>Cadastrar Treino</h2>

            <select
                name="cliente_id"
                value={form.cliente_id}
                onChange={handleChange}
                required
            >
                <option value="">Selecione o cliente</option>
                {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                        {client.nome}
                    </option>
                ))}
            </select>

            <select
                name="intensidade"
                value={form.intensidade}
                onChange={handleChange}
                required
            >
                <option value="">Selecione a intensidade</option>
                <option value="Leve">Leve</option>
                <option value="Moderado">Moderado</option>
                <option value="Difícil">Difícil</option>
                <option value="Livre">Livre</option>
            </select>

            <input
                type="time"
                step="1"
                name="tempo_treino"
                placeholder="00:00:00"
                value={form.tempo_treino}
                onChange={handleChange}
                required
            />

            <select
                name="tipo_treino"
                value={form.tipo_treino}
                onChange={handleChange}
                required
            >
                <option value="">Selecione o tipo de treino</option>
                <option value="Contínuo">Contínuo</option>
                <option value="Intervalado">Intervalado</option>
                <option value="Progressivo">Progressivo</option>
                <option value="Recuperação">Recuperação</option>
                <option value="Hipertrofia">Hipertrofia</option>
                <option value="Emagrecimento">Emagrecimento</option>
                <option value="Saúde">Saúde</option>
                <option value="Preparação Física">Preparação Física</option>
                <option value="Outros">Outros</option>
            </select>

            <textarea
                name="descricao"
                placeholder="Descrição do treino..."
                value={form.descricao}
                onChange={handleChange}
                rows={3}
            />

            <button type="submit">Salvar Treino</button>
        </form>
    );
};

export default CreateTraining;
