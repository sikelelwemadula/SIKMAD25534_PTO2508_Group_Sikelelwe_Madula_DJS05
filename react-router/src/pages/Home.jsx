import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

/**
 * Podcast preview object returned from the API.
 * @typedef {Object} PodcastShow
 * @property {string} id - Unique identifier for the podcast show.
 * @property {string} title - The name/title of the podcast.
 * @property {string} image - Absolute URL to the show's cover artwork image.
 */

/**
 * React Router location state object structure.
 * @typedef {Object} LocationState
 * @property {string} [searchTerm] - Persisted search query passed back from child views.
 */

/**
 * Main landing page component that fetches, filters, and displays a grid of podcast shows.
 * Implements client-side filtering and preserves search state via history history location state.
 *
 * @component
 * @returns {JSX.Element} The rendered search input bar and grid layout of podcast cards.
 */
function Home() {
  /**
   * Router location hook used to extract persisted search parameters from the history state stack.
   * @type {import('react-router-dom').Location<LocationState>}
   */
  const location = useLocation();
  
  /**
   * Filter query input state. Initialized with previous location state history if present.
   * @type {[string, React.Dispatch<React.SetStateAction<string>>]}
   */
  const [searchTerm, setSearchTerm] = useState(location.state?.searchTerm || '');

  /**
   * Collection of all unfiltered podcast shows loaded from the network API.
   * @type {[PodcastShow[], React.Dispatch<React.SetStateAction<PodcastShow[]>>]}
   */
  const [shows, setShows] = useState([]);

  /**
   * Network request pending resolution status flag.
   * @type {[boolean, React.Dispatch<React.SetStateAction<boolean>>]}
   */
  const [loading, setLoading] = useState(true);

  /**
   * Fetches the complete catalogue list of podcasts on mount.
   * Silently catches structural or HTTP transport failures by ending the loading layout phase.
   */
  useEffect(() => {
    fetch('https://podcast-api.netlify.app')
      .then((res) => res.json())
      .then((data) => {
        setShows(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  /**
   * Derived collection filtered down based on matches between titles and the text input value.
   * @type {PodcastShow[]}
   */
  const filteredShows = shows.filter(show => 
    show.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div>Loading podcasts...</div>;

  return (
    <div>
      <input 
        type="text" 
        placeholder="Search podcasts..." 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="podcast-grid">
        {filteredShows.map((show) => (
          <div key={show.id} className="podcast-card">
            <img src={show.image} alt={show.title} width="150" />
            <h3>{show.title}</h3>
            {/* Pass the current filter state along with the navigation */}
            <Link to={`/show/${show.id}`} state={{ searchTerm }}>
              View Show
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
