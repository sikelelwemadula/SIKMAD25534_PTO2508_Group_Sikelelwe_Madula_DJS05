import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { PodcastProvider } from "./context/PodcastContext";
import { fetchPodcasts } from "./api/fetchPodcasts";
import { genres } from "./data";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import SortSelect from "./components/SortSelect";
import GenreFilter from "./components/GenreFilter";
import PodcastGrid from "./components/PodcastGrid";
import Pagination from "./components/Pagination";
import styles from "./App.module.css";
import ShowDetail from "./pages/ShowDetail";

/**
 * Properties for the HomePage layout component.
 * @typedef {Object} HomePageProps
 * @property {boolean} loading - Network flag indicating if global podcast data is fetching.
 * @property {string|null} error - Contains the raw error message string if a fetch request fails.
 */

/**
 * Presentation component wrapper that renders the primary control bar and data layouts.
 * Integrates search parameters, genre options, and grid lists into a semantic layout.
 *
 * @component
 * @param {HomePageProps} props - The structural loading and error state properties.
 * @returns {JSX.Element} The aggregated home view elements or placeholder message wrappers.
 */
function HomePage({ loading, error }) {
  return (
    <>
      <Header />

      <main className={styles.main}>
        <section className={styles.controls}>
          <SearchBar />
          <GenreFilter genres={genres} />
          <SortSelect />
        </section>

        {loading && (
          <div className={styles.messageContainer}>
            <div className={styles.spinner}></div>
            <p>Loading podcasts...</p>
          </div>
        )}

        {error && (
          <div className={styles.message}>
            <div className={styles.error}>
              Error occurred while fetching podcasts: {error}
            </div>
          </div>
        )}

        {!loading && !error && (
          <>
            <PodcastGrid genres={genres} />
            <Pagination />
          </>
        )}
      </main>
    </>
  );
}

/**
 * Root application component responsible for critical configuration wrappers.
 * Sets up global routing engines, mounts the context provider state tree,
 * and handles top-level data initialization requests upon mounting.
 *
 * @component
 * @returns {JSX.Element} The absolute base React Router tree structure.
 */
export default function App() {
  /**
   * Complete unfiltered dictionary array containing podcasts fetched from the API.
   * @type {[Array, React.Dispatch<React.SetStateAction<Array>>]}
   */
  const [podcasts, setPodcasts] = useState([]);

  /**
   * Pending network request status flag.
   * @type {[boolean, React.Dispatch<React.SetStateAction<boolean>>]}
   */
  const [loading, setLoading] = useState(true);

  /**
   * Captured message string reflecting request errors.
   * @type {[string|null, React.Dispatch<React.SetStateAction<string|null>>]}
   */
  const [error, setError] = useState(null);

  /**
   * Triggers the asynchronous payload dispatch wrapper configuration on assembly mount.
   */
  useEffect(() => {
    fetchPodcasts(setPodcasts, setError, setLoading);
  }, []);

  return (
    <Router>
      <div className="app-container">
        <PodcastProvider initialPodcasts={podcasts}>
          <Routes>
            <Route path="/" element={<HomePage loading={loading} error={error} />} />
            <Route path="/show/:id" element={<ShowDetail />} />
          </Routes>
        </PodcastProvider>
      </div>
    </Router>
  );
}
