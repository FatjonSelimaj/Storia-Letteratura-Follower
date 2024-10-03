import React, { useState, useEffect } from 'react';
import { FaSun, FaMoon, FaBars, FaTimes } from 'react-icons/fa'; // Icone per il menu e la modalità
import MenuItem from './MenuItem';  // Importa il componente MenuItem

const Navbar: React.FC = () => {
    const [darkMode, setDarkMode] = useState<boolean>(false); // Stato per gestire la modalità
    const [menuOpen, setMenuOpen] = useState<boolean>(false); // Stato per il menu mobile

    // Funzione per alternare tra modalità dark e light
    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        localStorage.setItem('theme', !darkMode ? 'dark' : 'light'); // Salva la preferenza nel localStorage
    };

    // Funzione per alternare l'apertura del menu mobile
    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    // Effetto per caricare la preferenza salvata
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            setDarkMode(savedTheme === 'dark');
        }
    }, []);

    // Cambia il tema del body a seconda della modalità
    useEffect(() => {
        if (darkMode) {
            document.body.classList.add('bg-gray-900', 'text-white');
            document.body.classList.remove('bg-white', 'text-gray-900');
        } else {
            document.body.classList.add('bg-white', 'text-gray-900');
            document.body.classList.remove('bg-gray-900', 'text-white');
        }
    }, [darkMode]);

    return (
        <nav className={`p-4 fixed w-full top-0 left-0 z-50 ${darkMode ? 'bg-gray-900' : 'bg-gray-800'}`}>
            <div className="container mx-auto flex justify-between items-center">
                {/* Icona menu hamburger per schermi mobili */}
                <button
                    onClick={toggleMenu}
                    className="text-white text-2xl focus:outline-none md:hidden"
                >
                    {menuOpen ? <FaTimes /> : <FaBars />}
                </button>

                {/* Menu di navigazione con effetto transizione */}
                <div
                    className={`fixed top-0 left-0 h-1/2 w-full bg-gray-800 md:bg-transparent z-40 flex flex-col justify-center items-center md:relative md:h-auto md:w-auto md:flex md:space-x-4 transition-transform duration-300 ease-in-out ${
                        menuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 md:opacity-100 md:transform-none'
                    }`}
                >
                    <button
                        onClick={toggleMenu}
                        className="absolute top-4 right-4 text-white text-2xl focus:outline-none md:hidden"
                    >
                        <FaTimes />
                    </button>

                    <MenuItem to="/" label="Home" darkMode={darkMode} />
                    <MenuItem to="/articles" label="Articles" darkMode={darkMode} />
                    <MenuItem to="/authors" label="Authors" darkMode={darkMode} />
                    <MenuItem to="/history-sections" label="History Sections" darkMode={darkMode} />
                    <MenuItem to="/works" label="Works" darkMode={darkMode} />
                </div>

                {/* Icona per alternare tra modalità dark e light */}
                <button
                    onClick={toggleDarkMode}
                    className="text-white flex items-center focus:outline-none"
                >
                    {darkMode ? (
                        <FaSun className="text-yellow-400" />
                    ) : (
                        <FaMoon className="text-gray-300" />
                    )}
                    <span className="ml-2 hidden md:inline">
                        {darkMode ? 'Light Mode' : 'Dark Mode'}
                    </span>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
