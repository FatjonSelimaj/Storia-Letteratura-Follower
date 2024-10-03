import React, { useState, useEffect } from 'react';
import { FaSearch, FaInfoCircle } from 'react-icons/fa';  // Importa le icone
import { getAuthors } from '../services/authorService';
import { useNavigate } from 'react-router-dom';
import { Author } from '../interfaces/authorInterface';

const AuthorList: React.FC = () => {
    const [authors, setAuthors] = useState<Author[]>([]);
    const [filteredAuthors, setFilteredAuthors] = useState<Author[]>([]); // Stato per gli autori filtrati
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState(''); // Stato per la query di ricerca
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAuthors = async () => {
            try {
                const data = await getAuthors();
                setAuthors(data);
                setFilteredAuthors(data); // Imposta gli autori filtrati uguali a quelli originali inizialmente
            } catch (err) {
                setError('Failed to fetch authors');
            } finally {
                setLoading(false);
            }
        };

        fetchAuthors();
    }, []);

    // Funzione per filtrare gli autori in base alla query di ricerca
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        setFilteredAuthors(
            authors.filter(author =>
                author.name.toLowerCase().includes(query) ||  // Filtra per nome
                author.biography?.toLowerCase().includes(query)  // Filtra per biografia
            )
        );
    };

    const handleViewDetails = (id: string) => {
        navigate(`/author-details/${id}`);  // Naviga alla pagina di dettagli dell'autore
    };

    return (
        <div className="container mx-auto p-6">
            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}

            <h1 className="text-3xl font-bold mb-4 text-blue-600">Authors</h1>

            {/* Barra di ricerca */}
            <div className="relative mb-6">
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearch}
                    placeholder="Search authors by name or biography..."
                    className="w-full p-3 pl-10 border text-black border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAuthors.length === 0 ? (
                    <p className="text-gray-600">No authors found</p>
                ) : (
                    filteredAuthors.map((author) => (
                        <div
                            key={author.id}
                            className="bg-white shadow-lg rounded-lg p-6 transform transition duration-300 hover:scale-105"
                        >
                            <h2 className="text-2xl font-semibold mb-2 text-blue-700">{author.name}</h2>
                            <p className="text-gray-600 mb-4">{author.biography}</p>
                            <button
                                className="flex items-center text-blue-500 font-medium hover:underline"
                                onClick={() => handleViewDetails(author.id)}  // Naviga alla pagina di visualizzazione
                            >
                                <FaInfoCircle className="mr-2" /> View Details
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AuthorList;
