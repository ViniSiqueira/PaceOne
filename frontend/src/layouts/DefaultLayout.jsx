import React from 'react';
import './DefaultLayout.css';
import Header from '../components/Header/Header';
import Menu from '../components/Menu/Menu';
import logo from '../assets/logoSecundario.png';
import { Outlet, useNavigate } from 'react-router-dom';

const DefaultLayout = () => {
    const navigate = useNavigate();

    const handleNavigateHome = () => {
        navigate('/home');
    };

    return (
        <div className="default-layout">
            <div style={{ flexDirection: 'column' }}>
                <img
                    src={logo}
                    alt="Logo"
                    className="default-layout-logo"
                    onClick={handleNavigateHome}
                />
                <Menu />
            </div>
            <div className="default-layout-content">
                <Header />
                <main className="main-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DefaultLayout;
