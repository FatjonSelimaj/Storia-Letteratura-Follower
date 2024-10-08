import React, { useState, useEffect } from 'react';
import { getWorks } from '../services/workService';
import { getAuthors } from '../services/authorService';
import { Work } from '../interfaces/workInterface';
import { Author } from '../interfaces/authorInterface';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa'; // Icona per View Details

const WorkList: React.FC = () => {
    const [works, setWorks] = useState<Work[]>([]);
    const [filteredWorks, setFilteredWorks] = useState<Work[]>([]); // Stato per i lavori filtrati
    const [authors, setAuthors] = useState<Author[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState(''); // Stato per la query di ricerca
    const navigate = useNavigate();

    useEffect(() => {
        const fetchWorks = async () => {
            try {
                const data = await getWorks();
                setWorks(data);
                setFilteredWorks(data); // Inizialmente, i lavori filtrati sono tutti i lavori
            } catch (err) {
                setError('Failed to fetch works');
            } finally {
                setLoading(false);
            }
        };

        const fetchAuthors = async () => {
            try {
                const authorData = await getAuthors();
                setAuthors(authorData);
            } catch (err) {
                setError('Failed to fetch authors');
            }
        };

        fetchWorks();
        fetchAuthors();
    }, []);

    const getAuthorName = (authorId: string) => {
        const author = authors.find((author) => author.id === authorId);
        return author ? author.name : 'Unknown Author';
    };

    // Funzione per gestire la ricerca
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        // Filtra i lavori in base alla query inserita
        setFilteredWorks(
            works.filter(work =>
                work.title.toLowerCase().includes(query) ||
                work.genre.toLowerCase().includes(query) ||
                getAuthorName(work.authorId).toLowerCase().includes(query)
            )
        );
    };

    return (
        <div className="container mx-auto p-6">
            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}
            <h1 className="text-2xl font-bold mb-4">Works</h1>

            {/* Barra di ricerca */}
            <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search works by title, genre, or author..."
                className="mb-6 p-2 border border-gray-500 text-black rounded w-full"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredWorks.length === 0 ? (
                    <p>No works found</p>
                ) : (
                    filteredWorks.map((work) => (
                        <div key={work.id} className="bg-white shadow-md rounded-lg p-4 transition-transform duration-300 hover:scale-105">
                            <h2 className="text-xl text-blue-500 font-bold">{work.title}</h2>
                            <p className="text-xl text-black">{work.genre}</p>
                            <p>{getAuthorName(work.authorId)}</p> {/* Mostra il nome dell'autore */}
                            <button
                                className="text-blue-500 font-medium flex items-center hover:underline"
                                onClick={() => navigate(`/work-details/${work.id}`)}
                            >
                                View Details <FaArrowRight className="ml-2" />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default WorkList;
