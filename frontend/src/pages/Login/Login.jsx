import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logoPrincipal.png'
import './Login.css'
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import Checkbox from '../../components/CheckBox/CheckBox';
import Label from '../../components/Label/Label';
import toast from 'react-hot-toast';

const Login = () => {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [manterConectado, setManterConectado] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    if (usuario === 'admin' && senha === '123') {
      localStorage.setItem('auth', 'true');
      toast.success('Login realizado com sucesso!');
      navigate('/home');
    } else {
      toast.error('Usuário ou senha inválidos');
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
