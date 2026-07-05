import { useContext } from "react";
import { SORT_OPTIONS, PodcastContext } from "../context/PodcastContext";
import styles from "./SortSelect.module.css";

/**
 * Sort options object structure.
 * @typedef {Object} SortOption
 * @property {string} key - The backend or state value used to sort data.
 * @property {string} label - The human-readable display string for the dropdown option.
 */

/**
 * A dropdown select component for changing the display order of podcasts.
 * Interacts with `PodcastContext` to update global sorting states and renders options
 * derived dynamically from the global `SORT_OPTIONS` configuration.
 *
 * @component
 * @returns {JSX.Element} A styled HTML select element for sorting.
 */
export default function SortSelect() {
  const { sortKey, setSortKey } = useContext(PodcastContext);

  return (
    <select
      className={styles.select}
      value={sortKey}
      onChange={(e) => setSortKey(e.target.value)}
    >
      {SORT_OPTIONS.map((o) => (
        <option key={o.key} value={o.key}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
