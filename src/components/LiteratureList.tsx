import React, { useEffect, useState } from 'react';
import { getLiteratures } from '../services/literatureService';  // Funzione per ottenere tutte le letterature
import { Literature } from '../interfaces/literatureInterface';
import { useNavigate } from 'react-router-dom';

const LiteratureList: React.FC = () => {
    const [literatures, setLiteratures] = useState<Literature[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLiteratures = async () => {
            try {
                const data = await getLiteratures();
                setLiteratures(data);
            } catch (err) {
                setError('Failed to fetch literatures');
            } finally {
                setLoading(false);
            }
        };

        fetchLiteratures();
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-4 text-blue-600">Literature List</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {literatures.length === 0 ? (
                    <p>No literatures found</p>
                ) : (
                    literatures.map((literature) => (
                        <div
                            key={literature.id}
                            className="bg-gradient-to-r from-blue-100 to-blue-300 shadow-lg rounded-lg p-6 transform transition duration-300 hover:scale-105 cursor-pointer"
                            onClick={() => navigate(`/literature/${literature.id}`)}
                        >
                            <h2 className="text-2xl font-semibold mb-2 text-blue-900">Author: {literature.author?.name}</h2>
                            <p className="text-gray-700">Work: {literature.work?.title}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default LiteratureList;
