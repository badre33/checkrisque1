import axios from 'axios';

export default async function handler(req, res) {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: 'Missing query' });

  try {
    const result = await axios.get(`https://api.opensanctions.org/entities?q=${encodeURIComponent(q)}`);
    const hits = result.data.results || [];

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

    res.status(200).json(categories);
  } catch (error) {
    console.error('API Proxy error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
