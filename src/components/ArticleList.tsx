import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getArticles } from '../services/articleService';
import { Article } from '../interfaces/articleInterface';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faEye } from '@fortawesome/free-solid-svg-icons';

const ArticleList: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const data = await getArticles();
                setArticles(data);
                setFilteredArticles(data);
            } catch (err) {
                setError('Failed to fetch articles');
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, []);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        setFilteredArticles(
            articles.filter(article =>
                article.title.toLowerCase().includes(query) ||
                article.content.toLowerCase().includes(query)
            )
        );
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="container mx-auto p-6">
            {/* Barra di ricerca */}
            <div className="mb-6 relative">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearch}
                    placeholder="Search articles by title or content..."
                    className="w-full p-3 border text-black border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
                <FontAwesomeIcon
                    icon={faSearch}
                    className="absolute right-3 top-3 text-gray-400"
                />
            </div>

            {/* Lista degli articoli filtrati */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredArticles.length === 0 ? (
                    <p>No articles found</p>
                ) : (
                    filteredArticles.map((article) => (
                        <div
                            key={article.id}
                            className="bg-white shadow-lg rounded-lg p-6 transform transition duration-300 hover:scale-105 hover:bg-gray-50"
                        >
                            <h2 className="text-2xl font-semibold mb-2 text-blue-700">
                                {article.title}
                            </h2>
                            <p className="text-gray-600 mb-4">
                                {article.content.slice(0, 100) + '...'}
                            </p>
                            <button
                                className="text-blue-600 font-medium hover:underline flex items-center"
                                onClick={() => navigate(`/article-details/${article.id}`)}
                            >
                                <FontAwesomeIcon icon={faEye} className="mr-2" />
                                Read More
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ArticleList;
