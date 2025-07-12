import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Menu.css';
import { MenuEnum } from '../../enum/MenuEnum';

const Menu = () => {
  const location = useLocation();

  return (
    <aside className="sidebar">      
      <nav className="menu-items">
        {MenuEnum.map(item => (
          <Link to={item.path} key={item.path} className={`menu-item ${location.pathname === item.path ? 'active' : ''}`}>
            <div className="menu-icon">{item.icon}</div>
            <div className="menu-label">{item.label}</div>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Menu;
