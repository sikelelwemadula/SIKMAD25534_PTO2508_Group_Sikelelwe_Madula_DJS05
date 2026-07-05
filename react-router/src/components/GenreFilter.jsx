import { useContext } from "react";
import { PodcastContext } from "../context/PodcastContext";
import styles from "./GenreFilter.module.css";

/**
 * Genre object structure.
 * @typedef {Object} Genre
 * @property {number} id - Unique identifier for the genre.
 * @property {string} title - Display title of the genre.
 */

/**
 * Component props structure.
 * @typedef {Object} GenreFilterProps
 * @property {Genre[]} genres - Array of available podcast genres.
 */

/**
 * A dropdown select component that filters podcasts by their genre.
 * Consumes the `PodcastContext` to manage and update the currently selected genre.
 *
 * @component
 * @param {GenreFilterProps} props - The component props.
 * @returns {JSX.Element} A styled HTML select dropdown.
 */
export default function GenreFilter({ genres }) {
  const { genre, setGenre } = useContext(PodcastContext);

  return (
    <select
      className={styles.select}
      value={genre}
      onChange={(e) => setGenre(e.target.value)}
    >
      <option value="all">All Genres</option>
      {genres.map((g) => (
        <option key={g.id} value={g.id}>
          {g.title}
        </option>
      ))}
    </select>
  );
}
