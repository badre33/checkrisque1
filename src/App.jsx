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
