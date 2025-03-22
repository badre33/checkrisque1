import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useReactToPrint } from 'react-to-print';

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const resultRef = useRef();

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const res = await axios.get(`/api/check?q=${encodeURIComponent(query)}`);
      const categories = res.data;
      setResults(categories);
    } catch (err) {
      console.error(err);
      setResults(null);
    }
    setLoading(false);
  };

  const handlePrint = useReactToPrint({
    content: () => resultRef.current,
  });

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
        <div ref={resultRef} className="mt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['pep', 'sanction', 'watchlist', 'wanted'].map((key) => (
              <div key={key} className="bg-white p-4 rounded shadow">
                <h2 className="text-lg font-semibold capitalize mb-2">{key}</h2>
                <p className={`font-bold ${results[key] ? 'text-red-600' : 'text-green-600'}`}>
                  {results[key] ? 'Correspondance trouvée' : 'Aucune correspondance'}
                </p>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-6">
            <button
              onClick={handlePrint}
              className="bg-gray-700 text-white px-6 py-2 rounded shadow"
            >
              Imprimer le rapport
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;