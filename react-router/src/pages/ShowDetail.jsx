import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import styles from "./Home.module.css";

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
  const [selectedSeason, setSelectedSeason] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) return <div className={styles.centerText}>Loading show details...</div>;
  if (error) return <div className={styles.centerText}>Error: {error}</div>;
  if (!show) return <div className={styles.centerText}>Show not found.</div>;

  const currentSeason = show.seasons?.[selectedSeason];

  return (
    <div className={styles.detailContainer}>
      <Link to="/" state={{ searchTerm: previousSearchTerm }} className={styles.backLink}>
        ← Back to Shows
      </Link>

      <div className={styles.showHeader}>
        <img src={show.image} alt={show.title} className={styles.coverImage} />
        <div className={styles.headerInfo}>
          <h1>{show.title}</h1>
          <p className={styles.description}>{show.description}</p>
          <p className={styles.metaText}><strong>Last Updated:</strong> {new Date(show.updated).toLocaleDateString()}</p>
          <div className={styles.genres}>
            {show.genres?.map(genreId => (
              <span key={genreId} className={styles.genreTag}>{GENRES[genreId]}</span>
            ))}
          </div>
        </div>
      </div>

      <hr className={styles.divider} />

      <h2 className={styles.sectionTitle}>Seasons</h2>
      <div className={styles.seasonSelector}>
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

      {currentSeason ? (
        <div>
          <div className={styles.seasonMetaBlock}>
            <img src={currentSeason.image || show.image} alt={currentSeason.title} className={styles.seasonThumb} />
            <h3>{currentSeason.title}</h3>
          </div>
          
          <ul className={styles.episodesList}>
            {currentSeason.episodes?.map((episode, idx) => (
              <li key={episode.id || idx} className={styles.episodeItem}>
                <h4>{episode.episode}. {episode.title}</h4>
                <p>{episode.description}</p>
                {episode.file && (
                  <audio controls src={episode.file} className={styles.audioPlayer}>
                    Your browser does not support the audio element.
                  </audio>
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className={styles.centerText}>No episodes available for this season.</p>
      )}
    </div>
  );
}

export default ShowDetail;
