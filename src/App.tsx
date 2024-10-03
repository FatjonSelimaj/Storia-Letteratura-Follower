import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import ArticleList from './components/ArticleList';
import AuthorList from './components/AuthorList';
import HistorySectionList from './components/HistorySectionList';
import WorkList from './components/WorkList';
import Home from './components/HomePage';  // Importa il componente Home
import AuthorDetails from './components/details/AuthorDetails';
import ArticleDetails from './components/details/ArticleDetails'; 
import HistorySectionDetails from './components/details/HistorySectionDetails';
import WorkDetails from './components/details/WorkDetails';

const App: React.FC = () => {
    return (
        <Router>
            <Navbar />
            <div className="container mx-auto mt-8">
                <Routes>
                    <Route path="/" element={<Home />} />  {/* Aggiunta della HomePage */}
                    <Route path="/articles" element={<ArticleList />} />
                    <Route path="/authors" element={<AuthorList />} />
                    <Route path="/history-sections" element={<HistorySectionList />} />
                    <Route path="/works" element={<WorkList />} />
                    <Route path="/author-details/:id" element={<AuthorDetails />} />  
                    <Route path="/article-details/:id" element={<ArticleDetails />} />
                    <Route path="/history-sections/:id" element={<HistorySectionDetails />} />
                    <Route path="/work-details/:id" element={<WorkDetails />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
