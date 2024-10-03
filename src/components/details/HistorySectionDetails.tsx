import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';  // Icona per tornare indietro
import { getHistorySectionById } from '../../services/historyService';  // Funzione per ottenere una sezione storica tramite ID
import { HistorySection } from '../../interfaces/historyInterface';
import { useNavigate } from 'react-router-dom';

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
        return <p>Loading...</p>;
    }

    if (error) {
        return <p className="text-red-500">{error}</p>;
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
                    <p className="text-gray-500">Historical Period: {historySection.historicalPeriod}</p>
                    <p className="text-gray-700 mb-6">{historySection.description}</p>
                </div>
            ) : (
                <p>History section not found</p>
            )}
        </div>
    );
};

export default HistorySectionDetails;
