import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';  // Importa `useNavigate` per la navigazione
import { getAuthorById } from '../../services/authorService'; // Funzione per ottenere l'autore per ID
import { Author } from '../../interfaces/authorInterface';
import { FaUser, FaSpinner, FaExclamationTriangle, FaArrowLeft } from 'react-icons/fa'; // Icone, incluso FaArrowLeft

const AuthorDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // Ottieni l'ID dai parametri dell'URL
    const [author, setAuthor] = useState<Author | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();  // Hook per la navigazione

    useEffect(() => {
        const fetchAuthor = async () => {
            try {
                if (id) {
                    const fetchedAuthor = await getAuthorById(id); // Recupera l'autore tramite l'ID
                    setAuthor(fetchedAuthor);
                }
            } catch (err) {
                setError('Failed to fetch author details.');
            } finally {
                setLoading(false);
            }
        };

        fetchAuthor();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <FaSpinner className="animate-spin text-blue-500 text-4xl" />
                <p className="ml-2 text-blue-500 text-xl">Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-64 text-red-500">
                <FaExclamationTriangle className="text-4xl" />
                <p className="ml-2 text-xl">{error}</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            <button 
                onClick={() => navigate(-1)}  // Funzione per tornare indietro
                className="flex items-center text-blue-500 hover:text-blue-700 mb-6"
            >
                <FaArrowLeft className="mr-2" /> Go Back
            </button>

            {author ? (
                <div className="bg-white shadow-lg rounded-lg p-6">
                    <div className="flex items-center mb-4">
                        <h1 className="text-3xl font-semibold text-blue-500">{author.name}</h1>
                    </div>
                    <hr className="my-4" />
                    <div className="text-lg text-gray-700">
                        {author.biography ? (
                            <p className="mb-6 leading-relaxed">
                                {author.biography}
                            </p>
                        ) : (
                            <p className="italic text-gray-500">No biography available for this author.</p>
                        )}
                    </div>
                </div>
            ) : (
                <p className="text-gray-500 text-center">Author not found</p>
            )}
        </div>
    );
};

export default AuthorDetails;
