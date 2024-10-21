import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Literature } from '../../interfaces/literatureInterface';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { getLiteratureById } from '../../services/literatureService';

const LiteratureDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();  // Estrai l'ID della letteratura dalla route
    const [literature, setLiterature] = useState<Literature | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLiterature = async () => {
            try {
                if (id) {
                    const fetchedLiterature = await getLiteratureById(id);
                    setLiterature(fetchedLiterature);
                }
            } catch (err) {
                setError('Failed to fetch literature details.');
            } finally {
                setLoading(false);
            }
        };

        fetchLiterature();
    }, [id]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="container mx-auto p-6">
            <button
                className="text-blue-600 hover:underline flex items-center mb-4"
                onClick={() => navigate(-1)}  // Funzione per tornare indietro
            >
                <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                Back
            </button>
            {literature ? (
                <div className="bg-white shadow-lg rounded-lg p-6">
                    <h1 className="text-3xl font-bold mb-4 text-blue-700">Author: {literature.author?.name}</h1>
                    <h2 className="text-2xl text-black font-semibold mb-2">Work: {literature.work?.title}</h2>
                    <p className="text-gray-600 mb-4">Genre: {literature.work?.genre}</p>
                </div>
            ) : (
                <p>Literature not found</p>
            )}
        </div>
    );
};

export default LiteratureDetails;
