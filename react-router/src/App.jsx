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

export default function App() {
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
