import { useContext } from "react";
import { PodcastContext } from "../context/PodcastContext";
import styles from "./Pagination.module.css";

/**
 * A numeric pagination control bar for navigating multi-page lists.
 * Consumes `PodcastContext` to determine active status and trigger page shifts.
 * Returns `null` automatically if there is only one page or fewer to display.
 *
 * @component
 * @returns {JSX.Element|null} The interactive pagination bar, or null if hidden.
 */
export default function Pagination() {
  const { page, setPage, totalPages } = useContext(PodcastContext);

  if (totalPages <= 1) return null;

  /**
   * Sequence array of page numbers from 1 up to totalPages.
   * @type {number[]}
   */
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className={styles.paginationWrapper}>
      {pages.map((p) => (
        <button
          key={p}
          className={`${styles.pageButton} ${p === page ? styles.active : ""}`}
          onClick={() => setPage(p)}
        >
          {p}
        </button>
      ))}
    </div>
  );
}
