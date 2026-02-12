import { useNavigate } from "react-router-dom";
import logo from "../../assets/KenzieHub.svg";
import styles from "./Header.module.scss";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../forms/Button/Button";

export const UserHeader = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut();
    navigate("/");
  };

  return (
    <header className={styles.userHeader}>
      <div className={styles.headerContent}>
        <img src={logo} alt="Logo Kenzie Hub" />
        <nav>
          <Button text="Sair" variant="small" onClick={handleLogout} />
        </nav>
      </div>
    </header>
  );
};
