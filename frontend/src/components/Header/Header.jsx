import React from 'react';
import user from '../../assets/user.png'
import { Avatar } from 'primereact/avatar';
import { IoMdNotifications } from "react-icons/io";
import { Badge } from 'primereact/badge';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <h3 className='text-header'>Sistema de gestão</h3>
      <div className='header-content'>
        <div className='header-notification'>
          <IoMdNotifications className='header-icon-notification' size={28} />
          <Badge className='header-badge-notification' value="5"></Badge>
        </div>
        <div>
          <Avatar image={user} size="large" shape="circle" />
        </div>
      </div>
    </header>
  );
};

export default Header;
