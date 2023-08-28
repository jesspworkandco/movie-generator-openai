import styles from "./App.module.css";
import Header from "./components/Header";
import MovieBoss from "./components/MovieBoss";

function App() {
  return (
    <div className={styles.app}>
      <Header />
      <MovieBoss />
    </div>
  );
}

export default App;
