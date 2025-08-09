import React from 'react';
import './Button.css';

const Button = ({
    children,
    onClick,
    type = 'button',
    backgroundColor = '#65D73D',
    hoverColor = '#3FB017',
    color = 'white',
}) => {
    return (
        <button
            className="custom-button"
            onClick={onClick}
            type={type}
            style={{
                backgroundColor,
                color,
                '--hover-color': hoverColor,
            }}
        >
            {children}
        </button>
    );
};

export default Button;
