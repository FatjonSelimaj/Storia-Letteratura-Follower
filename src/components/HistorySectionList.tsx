import React, { useState, useEffect } from 'react';
import { FaSearch, FaEye, FaDownload } from 'react-icons/fa';  // Importa le icone
import { getHistorySections } from '../services/historyService';
import { HistorySection } from '../interfaces/historyInterface';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf'; // Importa la libreria jsPDF

const HistorySectionList: React.FC = () => {
    const [historySections, setHistorySections] = useState<HistorySection[]>([]);
    const [filteredHistorySections, setFilteredHistorySections] = useState<HistorySection[]>([]); // Stato per le sezioni storiche filtrate
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState(''); // Stato per la query di ricerca
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHistorySections = async () => {
            try {
                const data = await getHistorySections();
                setHistorySections(data);
                setFilteredHistorySections(data); // Imposta le sezioni storiche filtrate uguali a quelle originali inizialmente
            } catch (err) {
                setError('Failed to fetch history sections');
            } finally {
                setLoading(false);
            }
        };

        fetchHistorySections();
    }, []);

    // Funzione per filtrare le sezioni storiche in base alla query di ricerca
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        setFilteredHistorySections(
            historySections.filter(section =>
                section.title.toLowerCase().includes(query) ||  // Filtra per titolo
                section.description.toLowerCase().includes(query) ||  // Filtra per descrizione
                section.historicalPeriod.toLowerCase().includes(query) // Filtra per periodo storico
            )
        );
    };

    return (
        <div className="container mx-auto p-6">
            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}
            <h1 className="text-3xl font-bold mb-4 text-blue-600">History Sections</h1>

            {/* Barra di ricerca */}
            <div className="container mx-auto p-6">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearch}
                    placeholder="Search history sections by title, description, or historical period..."
                    className="mb-6 p-2 border border-gray-500 text-black rounded w-full"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredHistorySections.length === 0 ? (
                    <p>No history sections found</p>
                ) : (
                    filteredHistorySections.map((section) => (
                        <HistorySectionCard 
                            key={section.id} 
                            section={section} 
                            onView={() => navigate(`/history-sections/${section.id}`)} // Naviga per visualizzare i dettagli
                        />
                    ))
                )}
            </div>
        </div>
    );
};

interface HistorySectionCardProps {
    section: HistorySection;
    onView: () => void;
}

const HistorySectionCard: React.FC<HistorySectionCardProps> = ({ section, onView }) => {
    const [showMore, setShowMore] = useState(false);

    const maxDescriptionLength = 100;
    const isLongDescription = section.description.length > maxDescriptionLength;

    const toggleShowMore = () => {
        setShowMore((prev) => !prev);
    };

    // Funzione per scaricare la sezione storica come file PDF
    const downloadPdf = () => {
        const doc = new jsPDF();
        doc.text(`Title: ${section.title}`, 10, 10);
        doc.text(`Description: ${section.description}`, 10, 20);
        doc.text(`Historical Period: ${section.historicalPeriod}`, 10, 30);
        doc.save(`${section.title}.pdf`);
    };

    return (
        <div className="bg-gradient-to-r from-blue-100 to-blue-300 shadow-lg rounded-lg p-6 transform transition duration-300 hover:scale-105">
            <h2 className="text-2xl font-semibold mb-2 text-blue-900">{section.title}</h2>
            <p className="text-gray-700">
                {showMore || !isLongDescription 
                    ? section.description 
                    : `${section.description.slice(0, maxDescriptionLength)}...`}
            </p>
            {isLongDescription && (
                <button onClick={toggleShowMore} className="text-blue-500 hover:underline mt-2">
                    {showMore ? 'Show Less' : 'Show More'}
                </button>
            )}
            <p className="text-gray-600 mt-2">Historical Period: {section.historicalPeriod}</p>
            <div className="mt-4 flex justify-between">
                <button 
                    className="flex items-center bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
                    onClick={onView}
                >
                    <FaEye className="mr-2" /> View Details
                </button>
                <button 
                    className="flex items-center bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition"
                    onClick={downloadPdf}
                >
                    <FaDownload className="mr-2" /> Download PDF
                </button>
            </div>
        </div>
    );
};

export default HistorySectionList;
