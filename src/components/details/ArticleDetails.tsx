import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getArticleById } from '../../services/articleService';
import { Article } from '../../interfaces/articleInterface';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const ArticleDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                if (id) {
                    const fetchedArticle = await getArticleById(id);
                    setArticle(fetchedArticle);
                }
            } catch (err) {
                setError('Failed to fetch article details.');
            } finally {
                setLoading(false);
            }
        };

        fetchArticle();
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
                onClick={() => navigate(-1)}  // Ritorna alla pagina precedente
            >
                <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                Back
            </button>
            {article ? (
                <div className="bg-white shadow-lg rounded-lg p-6">
                    <h1 className="text-3xl font-bold mb-4 text-blue-700">{article.title}</h1>
                    <p className="text-gray-700 mb-6">{article.content}</p>
                </div>
            ) : (
                <p>Article not found</p>
            )}
        </div>
    );
};

export default ArticleDetails;
