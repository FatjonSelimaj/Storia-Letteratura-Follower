import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getWorkById } from '../../services/workService'; // Funzione per ottenere il lavoro per ID
import { Work } from '../../interfaces/workInterface';
import { FaBook, FaArrowLeft, FaSpinner, FaExclamationTriangle } from 'react-icons/fa'; // Icone

const WorkDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // Ottieni l'ID dall'URL
    const [work, setWork] = useState<Work | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate(); // Hook per la navigazione

    useEffect(() => {
        const fetchWork = async () => {
            try {
                if (id) {
                    const fetchedWork = await getWorkById(id);
                    setWork(fetchedWork);
                }
            } catch (err) {
                setError('Failed to fetch work details.');
            } finally {
                setLoading(false);
            }
        };

        fetchWork();
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

            {work ? (
                <div className="bg-white shadow-lg rounded-lg p-6">
                    <div className="flex items-center mb-4">
                        <FaBook className="text-blue-500 text-3xl mr-3" />
                        <h1 className="text-3xl font-bold text-gray-900">{work.title}</h1>
                    </div>
                    <hr className="my-4" />
                    <p className="text-lg text-gray-700 mb-6">Genre: {work.genre}</p>
                    <p className="text-lg text-gray-700 mb-6">Author: {work.author.name}</p>
                </div>
            ) : (
                <p className="text-gray-500 text-center">Work not found</p>
            )}
        </div>
    );
};

export default WorkDetails;
