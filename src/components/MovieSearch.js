import React, { useState } from 'react';

function MovieSearch() {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const API_KEY = '99eb9fd1';
  const BASE_URL = 'https://www.omdbapi.com/';

  const searchMovies = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setError('Please enter a movie name');
      setMovies([]);
      setHasSearched(true);
      return;
    }

    setLoading(true);
    setError('');
    setHasSearched(true);

    try {
      const response = await fetch(
        `${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(searchQuery.trim())}`
      );
      const data = await response.json();

      if (data.Response === 'True') {
        setMovies(data.Search || []);
        setError('');
      } else {
        setMovies([]);
        setError('Invalid movie name. Please try again.');
      }
    } catch (err) {
      setMovies([]);
      setError('Invalid movie name. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchMovies(query);
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  return (
    <div className="movie-search-container">
      <h1>🎬 Movie Search</h1>
      <p className="subtitle">Search for your favorite movies using OMDb API</p>

      <form className="search-form" onSubmit={handleSearch}>
        <div className="search-input-group">
          <input
            type="text"
            className="search-input"
            placeholder="Enter movie name..."
            value={query}
            onChange={handleInputChange}
          />
          <button type="submit" className="search-btn" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {loading && (
        <div className="loading-container">
          <div className="loader"></div>
          <p>Loading movies...</p>
        </div>
      )}

      {error && (
        <div className="error">{error}</div>
      )}

      {!loading && !error && hasSearched && movies.length === 0 && (
        <div className="empty-state">
          <p>🔍 No movies found. Try a different search term.</p>
        </div>
      )}

      {!loading && !error && movies.length > 0 && (
        <div className="results-container">
          <p className="results-count">Found {movies.length} movies</p>
          <div className="movies-grid">
            {movies.map((movie) => (
              <div key={movie.imdbID} className="movie-card">
                {movie.Poster && movie.Poster !== 'N/A' ? (
                  <img 
                    src={movie.Poster} 
                    alt={movie.Title} 
                    className="movie-poster"
                  />
                ) : (
                  <div className="movie-poster-placeholder">
                    <span>🎬</span>
                    <p>No Poster</p>
                  </div>
                )}
                <div className="movie-info">
                  <h3 className="movie-title">{movie.Title}</h3>
                  <p className="movie-year">📅 {movie.Year}</p>
                  <p className="movie-type">🎯 {movie.Type}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default MovieSearch;
