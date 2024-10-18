import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';  // Icone per caricamento e errore
import { getHistorySectionById } from '../../services/historyService';  // Funzione per ottenere una sezione storica tramite ID
import { HistorySection } from '../../interfaces/historyInterface';

const HistorySectionDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();  // Estrai l'ID dalla route
    const [historySection, setHistorySection] = useState<HistorySection | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();  // Hook per navigare

    useEffect(() => {
        const fetchHistorySection = async () => {
            try {
                if (id) {
                    const fetchedHistorySection = await getHistorySectionById(id);  // Recupera la sezione storica tramite l'ID
                    setHistorySection(fetchedHistorySection);
                }
            } catch (err) {
                setError('Failed to fetch history section details.');
            } finally {
                setLoading(false);
            }
        };

        fetchHistorySection();
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
                <button 
                    className="ml-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600" 
                    onClick={() => window.location.reload()}
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            {historySection ? (
                <div className="bg-white shadow-lg rounded-lg p-6">
                    <button 
                        className="flex items-center text-blue-500 hover:underline mb-4"
                        onClick={() => navigate(-1)}  // Funzione per tornare indietro
                    >
                        <FaArrowLeft className="mr-2" /> Back
                    </button>
                    <h1 className="text-3xl font-bold mb-4 text-blue-700">{historySection.title}</h1>
                    <p className="text-gray-500 mb-2">Historical Period: {historySection.historicalPeriod}</p>
                    <p className="text-gray-700">{historySection.description}</p>
                </div>
            ) : (
                <p className="text-gray-500 text-center">History section not found</p>
            )}
        </div>
    );
};

export default HistorySectionDetails;
