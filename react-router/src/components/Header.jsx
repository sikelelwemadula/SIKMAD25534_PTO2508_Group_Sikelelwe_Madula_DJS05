import styles from "./Header.module.css";

/**
 * A presentation header component displaying the main application title.
 * Renders a semantic HTML `<header>` element with standard styling.
 *
 * @component
 * @returns {JSX.Element} The rendered application header banner.
 */
export default function Header() {
  return (
    <header className={styles.appHeader}>
      <h1>🎙️ Podcast App</h1>
    </header>
  );
}
