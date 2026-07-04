import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Home() {
  const location = useLocation();
  
  // Restore search term if navigating back from a detail page
  const [searchTerm, setSearchTerm] = useState(location.state?.searchTerm || '');
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://podcast-api.netlify.app')
      .then((res) => res.json())
      .then((data) => {
        setShows(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

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