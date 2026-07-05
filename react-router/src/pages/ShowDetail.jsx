import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { genres } from '../data';
import styles from "./Home.module.css";

function getGenreLabel(genreValue) {
  if (genreValue === null || genreValue === undefined || genreValue === "") {
    return "Unknown Genre";
  }

  const rawValue = String(genreValue).trim();
  const normalizedValue = rawValue.toLowerCase();

  const match = genres.find((item) => {
    const itemTitle = item.title?.toLowerCase() || "";
    return (
      item.id === Number(genreValue) ||
      itemTitle === normalizedValue ||
      itemTitle.includes(normalizedValue) ||
      normalizedValue.includes(itemTitle)
    );
  });

  return match?.title || rawValue;
}

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

          <div className={styles.metaSummary}>
            <p className={styles.metaText}><strong>Last Updated:</strong> {new Date(show.updated).toLocaleDateString()}</p>
            <p className={styles.metaText}><strong>Total Seasons:</strong> {show.seasons?.length || 0}</p>
            <p className={styles.metaText}><strong>Total Episodes:</strong> {(show.seasons || []).reduce((total, season) => total + (season.episodes?.length || 0), 0)}</p>
          </div>

          <div className={styles.genres}>
            {(show.genres || []).map((genreValue, index) => (
              <span key={`${genreValue}-${index}`} className={styles.genreTag}>
                {getGenreLabel(genreValue)}
              </span>
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
