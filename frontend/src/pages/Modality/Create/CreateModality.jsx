import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { API_BACKEND_URL } from '../../../constants/url';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaDumbbell, FaBicycle, FaRunning, FaSwimmer, FaBasketballBall, FaWalking } from 'react-icons/fa';
import './CreateModality.css';

const allIcons = [
    { name: 'FaDumbbell', icon: <FaDumbbell /> },
    { name: 'FaBicycle', icon: <FaBicycle /> },
    { name: 'FaRunning', icon: <FaRunning /> },
    { name: 'FaSwimmer', icon: <FaSwimmer /> },
    { name: 'FaBasketballBall', icon: <FaBasketballBall /> },
    { name: 'FaWalking', icon: <FaWalking /> },
];

const CreateModality = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const modalityToEdit = location.state?.modality;

    const [form, setForm] = useState(() => ({
        id: modalityToEdit?.id || '',
        descricao: modalityToEdit?.descricao || '',
        icone: modalityToEdit?.icone || '',
        cor_icon: modalityToEdit?.cor_icon || '#000000',
    }));

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleIconSelect = (iconName) => {
        setForm({ ...form, icone: iconName });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const method = form.id ? 'PUT' : 'POST';
        const url = form.id
            ? `${API_BACKEND_URL}/api/modalidade/${form.id}`
            : `${API_BACKEND_URL}/api/modalidade`;

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Erro ao salvar modalidade');
            }

            toast.success('Modalidade salvo com sucesso!');
            navigate('/listModality');
        } catch (error) {
            toast.error(error.message);
            console.error('Erro ao salvar modalidade:', error);
        }
    };

    return (
        <form className="form-container" onSubmit={handleSubmit}>
            <h2>Cadastro de Modalidade</h2>

            <input
                type="text"
                name="descricao"
                placeholder="Descrição"
                value={form.descricao}
                onChange={handleChange}
                required
            />

            <div className="icon-picker">
                {allIcons.map(({ name, icon }) => (
                    <div
                        key={name}
                        className={`icon-option ${form.icone === name ? 'selected' : ''}`}
                        onClick={() => handleIconSelect(name)}
                    >
                        {icon}
                    </div>
                ))}
            </div>

            <input
                type="color"
                name="cor_icon"
                value={form.cor_icon}
                onChange={handleChange}
            />

            <button type="submit">Cadastrar</button>
        </form>
    );
};

export default CreateModality;
