import React, { useState, useEffect } from 'react';
import { FaSearch, FaArrowRight, FaDownload } from 'react-icons/fa';  // Icone
import { getAuthors } from '../services/authorService';
import { useNavigate } from 'react-router-dom';
import { Author } from '../interfaces/authorInterface';
import jsPDF from 'jspdf'; // Importa jsPDF per il download in PDF

const AuthorList: React.FC = () => {
    const [authors, setAuthors] = useState<Author[]>([]);
    const [filteredAuthors, setFilteredAuthors] = useState<Author[]>([]); // Stato per autori filtrati
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState(''); // Stato per la query di ricerca
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAuthors = async () => {
            try {
                const data = await getAuthors();
                setAuthors(data);
                setFilteredAuthors(data); // Imposta autori filtrati uguali a quelli originali inizialmente
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

    const downloadPdf = (author: Author) => {
        const doc = new jsPDF();
        doc.text(`Name: ${author.name}`, 10, 10);
        doc.text(`Biography: ${author.biography || 'No biography available'}`, 10, 20);
        doc.save(`${author.name}.pdf`);
    };

    return (
        <div className="container mx-auto p-6">
            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}

            <h1 className="text-3xl font-bold mb-4 text-blue-600">Authors</h1>

            {/* Barra di ricerca */}
            <div className="container mx-auto p-6">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearch}
                    placeholder="Search authors by name or biography..."
                    className="w-full p-3 pl-10 border border-gray-500 text-black rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAuthors.length === 0 ? (
                    <p className="text-gray-600">No authors found</p>
                ) : (
                    filteredAuthors.map((author) => (
                        <div
                            key={author.id}
                            className="bg-gradient-to-r from-green-100 to-green-300 shadow-md rounded-lg p-4 transition-transform duration-300 hover:scale-105"
                        >
                            <h2 className="text-xl text-green-800 font-bold">{author.name}</h2>
                            <p className="text-gray-700 mb-4">
                                {author.biography ? `${author.biography.slice(0, 100)}...` : 'No biography available'}
                            </p>
                            <div className="flex justify-between">
                                <button
                                    className="text-green-600 font-medium flex items-center hover:underline"
                                    onClick={() => handleViewDetails(author.id)}
                                >
                                    View Details <FaArrowRight className="ml-2" /> {/* Icona per View Details */}
                                </button>
                                <button
                                    className="text-green-600 font-medium flex items-center hover:underline"
                                    onClick={() => downloadPdf(author)}
                                >
                                    <FaDownload className="ml-2" /> Download PDF
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AuthorList;
