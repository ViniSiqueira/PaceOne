import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logoPrincipal.png';
import './Login.css';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import Checkbox from '../../components/CheckBox/CheckBox';
import Label from '../../components/Label/Label';
import toast from 'react-hot-toast';
import { API_BACKEND_URL } from '../../constants/url';

const Login = () => {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [manterConectado, setManterConectado] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!usuario || !senha) {
      toast.error('Por favor, preencha usuário e senha');
      return;
    }

    try {
      const response = await fetch(`${API_BACKEND_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_name: usuario, senha }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || 'Erro ao fazer login');
        return;
      }
      
      if (manterConectado) {
        localStorage.setItem('token', data.token);
      } else {
        sessionStorage.setItem('token', data.token);
      }

      toast.success('Login realizado com sucesso!');
      navigate('/home');
    } catch (error) {
      toast.error('Erro ao conectar no servidor');
      console.error(error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-container-form">
        <img src={logo} alt="Logo" className="login-logo" />
        
        <Input
          label="Usuário"
          type="text"
          placeholder="Digite seu usuário..."
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
        />
        <Input
          label="Senha"
          type="password"
          placeholder="***********"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
        <div className="login-options">
          <Checkbox
            label="Mantenha-me conectado"
            checked={manterConectado}
            onChange={(e) => setManterConectado(e.target.checked)}
          />
          <Label text="Esqueci minha senha" href="/" />
        </div>
        <Button onClick={handleLogin}>Acessar</Button>
      </div>
    </div>
  );
};

export default Login;
