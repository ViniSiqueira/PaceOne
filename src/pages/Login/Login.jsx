import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logoPrincipal.png'
import './Login.css'
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';

const Login = () => {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    if (usuario === 'admin' && senha === '123') {
      localStorage.setItem('auth', 'true');
      navigate('/home');
    } else {
      alert('Login inválido');
    }
  };

  return (
    <div className='login-container'>
      <div className='login-container-form'>
        <img src={logo} alt="Logo" className="login-logo" />
        <Input
          label="Login"
          type="email"
          placeholder="Digite seu email..."
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
        />
        <Input
          label="Senha"
          type="password"
          placeholder="***************"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
        <div className="login-options">
          <label>
            <input type="checkbox" />
            Mantenha-me conectado
          </label>
          <a href="/">Esqueci minha senha</a>
        </div>
        <Button
          onClick={handleLogin}        
        >
          Acessar
        </Button>
      </div>
    </div>
  );
};

export default Login;
