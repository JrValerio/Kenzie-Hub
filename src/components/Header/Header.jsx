import logo from "../../assets/KenzieHub.svg";
import styles from "./Header.module.scss";

export const Header = () => {
  return (
    <header className={styles.appHeader}>
      <div className={styles.headerContent}>
        <img className={styles.headerLogo} src={logo} alt="Logo Kenzie Hub" />
      </div>
    </header>
  );
};
