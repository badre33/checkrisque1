import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const res = await axios.get(`https://api.opensanctions.org/entities?q=${encodeURIComponent(query)}`);
      const hits = res.data.results || [];

      const categories = {
        pep: false,
        sanction: false,
        watchlist: false,
        wanted: false
      };

      hits.forEach(entity => {
        const topics = entity.topics || [];
        if (topics.includes('crime')) categories.wanted = true;
        if (topics.includes('sanction')) categories.sanction = true;
        if (topics.includes('watchlist')) categories.watchlist = true;
        if (topics.includes('pep')) categories.pep = true;
      });

      setResults(categories);
    } catch (err) {
      console.error(err);
      setResults(null);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">CheckRisque.ma</h1>
      <p className="text-center mb-6 text-gray-700">Vérifiez si une personne ou une entité figure sur les listes PEP, sanctions, watchlists ou avis de recherche.</p>

      <div className="flex justify-center mb-4">
        <input
          type="text"
          className="border p-2 rounded-l w-1/2"
          placeholder="Nom de la personne ou entité"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded-r"
        >
          Vérifier
        </button>
      </div>

      {loading && <p className="text-center text-gray-600">Recherche en cours...</p>}

      {results && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {['pep', 'sanction', 'watchlist', 'wanted'].map((key) => (
            <div key={key} className="bg-white p-4 rounded shadow">
              <h2 className="text-lg font-semibold capitalize mb-2">{key}</h2>
              <p className={`font-bold ${results[key] ? 'text-red-600' : 'text-green-600'}`}>
                {results[key] ? 'Correspondance trouvée' : 'Aucune correspondance'}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;