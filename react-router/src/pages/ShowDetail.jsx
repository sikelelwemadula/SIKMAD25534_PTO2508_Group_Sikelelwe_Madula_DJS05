import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { genres } from '../data';
import styles from "./Home.module.css";

/**
 * Episode object structure.
 * @typedef {Object} Episode
 * @property {string|number} id - Unique identifier for the episode.
 * @property {number} episode - The sequential number of the episode in its season.
 * @property {string} title - The title of the episode.
 * @property {string} description - Brief summary of the episode content.
 * @property {string} [file] - Absolute URL path to the streamable audio file.
 */

/**
 * Season object structure.
 * @typedef {Object} Season
 * @property {number|string} [season] - Sequential identifier of the season.
 * @property {string} title - Display title of the season.
 * @property {string} [image] - Thumbnail image URL specific to this season.
 * @property {Episode[]} episodes - Collection of episodes belonging to this season.
 */

/**
 * Detailed information payload for an individual podcast show.
 * @typedef {Object} DetailedShowData
 * @property {string} id - Unique identifier for the podcast show.
 * @property {string} title - The main name of the show.
 * @property {string} description - Comprehensive summary description.
 * @property {string} image - Absolute URL path to the main show artwork banner.
 * @property {string|number} updated - Timestamp or ISO date string of the last update.
 * @property {Season[]} seasons - Array of seasons structured inside the show.
 * @property {(string|number)[]} genres - Raw genre lookup flags or names.
 */

/**
 * Normalises a genre input identifier or fragment to find its human-readable title.
 * Scans static dataset reference keys for robust soft text alignment matching.
 *
 * @param {string|number|null|undefined} genreValue - Raw value representing a target genre.
 * @returns {string} The identified human-readable title, or the fallback raw value string.
 */
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

/**
 * Main detail wrapper page layout displaying deep metadata, seasons, and episodes.
 * Requests data over the network via specific url query route ID arguments.
 * Rescues navigation state tracking so search indices remain unbroken when returning home.
 *
 * @component
 * @returns {JSX.Element} The rendered full profile layout view or state condition notices.
 */
function ShowDetail() {
  /**
   * Extracted string map containing parameters parsed from the active browser address query route.
   * @type {Object.<string, string>}
   */
  const { id } = useParams();

  /**
   * Router location history state track reference tool.
   * @type {import('react-router-dom').Location}
   */
  const location = useLocation();
  
  /**
   * Active unpacked details response structure hook.
   * @type {[DetailedShowData|null, React.Dispatch<React.SetStateAction<DetailedShowData|null>>]}
   */
  const [show, setShow] = useState(null);

  /**
   * Index position identifier tracking which season dataset is currently active.
   * @type {[number, React.Dispatch<React.SetStateAction<number>>]}
   */
  const [selectedSeason, setSelectedSeason] = useState(0);

  /**
   * Active background process network loading state flag toggler.
   * @type {[boolean, React.Dispatch<React.SetStateAction<boolean>>]}
   */
  const [loading, setLoading] = useState(true);

  /**
   * Active error capture message container block.
   * @type {[string|null, React.Dispatch<React.SetStateAction<string|null>>]}
   */
  const [error, setError] = useState(null);

  /**
   * Rescued query term cache key parameter payload extracted from route tracking.
   * @type {string}
   */
  const previousSearchTerm = location.state?.searchTerm || '';

  /**
   * Dispatches automated profile lookup triggers targeting independent remote show identification keys.
   */
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

  /**
   * Derived season structure profile matching the active selected layout state index.
   * @type {Season|undefined}
   */
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
