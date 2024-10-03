import React from 'react';
import { Link } from 'react-router-dom';

interface MenuItemProps {
    to: string;
    label: string;
    darkMode: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({ to, label, darkMode }) => {
    return (
        <Link
            to={to}
            className={`mr-4 ${darkMode ? 'text-white' : 'text-gray-200'} py-2 px-4 block md:inline-block`}
        >
            {label}
        </Link>
    );
};

export default MenuItem;
