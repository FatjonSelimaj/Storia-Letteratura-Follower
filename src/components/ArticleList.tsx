import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getArticles } from '../services/articleService';
import { Article } from '../interfaces/articleInterface';
import { FaArrowRight, FaDownload } from 'react-icons/fa'; // Icone per View Details e Download PDF
import jsPDF from 'jspdf'; // Importa jsPDF per generare PDF

const ArticleList: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>(''); // Stato per la query di ricerca
    const navigate = useNavigate();

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const data = await getArticles();
                setArticles(data);
                setFilteredArticles(data); // Imposta inizialmente i lavori filtrati uguali agli articoli
            } catch (err) {
                setError('Failed to fetch articles');
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, []);

    // Funzione per gestire la ricerca
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        // Filtra gli articoli in base alla query inserita
        setFilteredArticles(
            articles.filter(article =>
                article.title.toLowerCase().includes(query) ||
                article.content.toLowerCase().includes(query)
            )
        );
    };

    // Funzione per scaricare il contenuto dell'articolo in formato PDF
    const downloadPdf = (article: Article) => {
        const doc = new jsPDF();
        doc.text(`Title: ${article.title}`, 10, 10);
        doc.text(`Content: ${article.content.slice(0, 100)}...`, 10, 20);
        doc.save(`${article.title}.pdf`);
    };

    return (
        <div className="container mx-auto p-6">
            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}
            <h1 className="text-2xl font-bold mb-4">Articles</h1>

            {/* Barra di ricerca */}
            <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search articles by title or content..."
                className="mb-6 p-2 border border-gray-500 text-black rounded w-full"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.length === 0 ? (
                    <p>No articles found</p>
                ) : (
                    filteredArticles.map((article) => (
                        <div
                            key={article.id}
                            className="bg-gradient-to-r from-yellow-100 to-yellow-300 shadow-md rounded-lg p-4 transition-transform duration-300 hover:scale-105"
                        >
                            <h2 className="text-xl text-yellow-800 font-bold">{article.title}</h2>
                            <p className="text-gray-700">{article.content.slice(0, 100)}...</p>
                            <div className="flex justify-between mt-4">
                                <button
                                    className="text-yellow-600 font-medium flex items-center hover:underline"
                                    onClick={() => navigate(`/article-details/${article.id}`)}
                                >
                                    Read More <FaArrowRight className="ml-2" />
                                </button>
                                <button
                                    className="text-yellow-600 font-medium flex items-center hover:underline"
                                    onClick={() => downloadPdf(article)}
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

export default ArticleList;
