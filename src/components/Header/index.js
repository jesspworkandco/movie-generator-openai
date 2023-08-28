import React from "react";
import movieLogo from "../../assets/images/logo-movie.png";

import styles from "./index.module.css";

const Header = () => {
  return (
    <div className={styles.header}>
      <img className={styles.image} src={movieLogo} alt="MoviePitch" />
      <a href="/">
        <span>Movie</span>Pitch
      </a>
    </div>
  );
};

export default Header;
