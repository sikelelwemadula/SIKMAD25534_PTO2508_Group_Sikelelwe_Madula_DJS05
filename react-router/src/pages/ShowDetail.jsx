import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';

/**
 * Genre mapping utility
 */
const GENRES = {
  1: "Personal Growth",
  2: "Investigative Journalism",
  3: "History",
  4: "Comedy",
  5: "Entertainment",
  6: "Business",
  7: "Fiction",
  8: "News",
  9: "Kids and Family"
};

function ShowDetail() {
  const { id } = useParams();
  const location = useLocation();
  
  const [show, setShow] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState(0); // Index of the active season
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Extract the preserved search term to pass back to Home
  const previousSearchTerm = location.state?.searchTerm || '';

  useEffect(() => {
    setLoading(true);
    fetch(`https://podcast-api.netlify.app/id/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch show details.');
        return res.json();
      })
      .then((data) => {
        setShow(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div>Loading show details...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!show) return <div>Show not found.</div>;

  // Safeguard if a show has no seasons listed
  const currentSeason = show.seasons?.[selectedSeason];

  return (
    <div className="show-detail-container">
      {/* Back button that preserves the search filter state */}
      <Link to="/" state={{ searchTerm: previousSearchTerm }}>
        ← Back to Shows
      </Link>

      <div className="show-header">
        <img src={show.image} alt={show.title} style={{ maxWidth: '300px' }} />
        <h1>{show.title}</h1>
        <p>{show.description}</p>
        <p><strong>Last Updated:</strong> {new Date(show.updated).toLocaleDateString()}</p>
        <div className="genres">
          {show.genres?.map(genreId => (
            <span key={genreId} className="genre-tag">{GENRES[genreId]}</span>
          ))}
        </div>
      </div>

      <hr />

      {/* Season Navigation System */}
      <h2>Seasons</h2>
      <div className="season-selector">
        <select 
          value={selectedSeason} 
          onChange={(e) => setSelectedSeason(Number(e.target.value))}
        >
          {show.seasons?.map((season, index) => (
            <option key={season.season || index} value={index}>
              {season.title} ({season.episodes?.length || 0} Episodes)
            </option>
          ))}
        </select>
      </div>

      {/* Active Season Episodes Display */}
      {currentSeason ? (
        <div className="episodes-list">
          <h3>{currentSeason.title}</h3>
          <img src={currentSeason.image || show.image} alt={currentSeason.title} style={{ width: '150px' }} />
          
          <ul>
            {currentSeason.episodes?.map((episode, idx) => (
              <li key={episode.id || idx} className="episode-item">
                <h4>{episode.episode}. {episode.title}</h4>
                <p>{episode.description}</p>
                {episode.file && (
                  <audio controls src={episode.file}>
                    Your browser does not support the audio element.
                  </audio>
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No episodes available for this season.</p>
      )}
    </div>
  );
}

export default ShowDetail;