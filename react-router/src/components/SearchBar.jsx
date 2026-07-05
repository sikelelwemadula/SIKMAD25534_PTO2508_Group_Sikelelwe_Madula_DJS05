import { useState, useEffect, useContext } from "react";
import { PodcastContext } from "../context/PodcastContext";
import styles from "./SearchBar.module.css";

/**
 * An interactive text input component that filters podcasts by a search query.
 * Syncs with global `PodcastContext` state using a local debounce mechanism
 * to limit API/state updates while typing.
 *
 * @component
 * @returns {JSX.Element} A styled HTML search input element.
 */
export default function SearchBar() {
  /**
   * Global search query and state setter from the context.
   */
  const { search, setSearch } = useContext(PodcastContext);

  /**
   * Local immediate state of the text input field.
   * @type {[string, React.Dispatch<React.SetStateAction<string>>]}
   */
  const [value, setValue] = useState(search);

  /**
   * Debounces the local `value` changes by 300ms before committing the 
   * final query value to the global `PodcastContext` state.
   */
  useEffect(() => {
    const id = setTimeout(() => setSearch(value), 300);
    return () => clearTimeout(id);
  }, [value, setSearch]);

  return (
    <input
      type="search"
      placeholder="Search podcasts…"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className={styles.searchInput}
    />
  );
}
