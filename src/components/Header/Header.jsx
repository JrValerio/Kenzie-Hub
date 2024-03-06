import logo from "../../assets/KenzieHub.svg";
import { Button } from "../forms/Button/Button";
import styles from "./Header.module.scss";
import "../../styles/button.scss";
import { useAuth } from "../../providers/AuthContext";
import { useNavigate } from "react-router-dom";

export const Header = ({ showLogout, showBack, isUserPage }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const headerClass = `${styles.appHeader} ${
    isUserPage ? styles.userPage : ""
  } ${showBack || showLogout ? styles.btnHeader : ""}`;

  const handleLogout = () => {
    signOut(navigate);
  };

  return (
    <header className={headerClass}>
      <div className={styles.headerContent}>
        <img className={styles.headerLogo} src={logo} alt="Logo Kenzie Hub" />
        <nav>
          {showBack && (
            <Button
              text="Voltar"
              variant="secondary"
              onClick={() => window.history.back()}
              className="btnHeader"
            />
          )}
          {showLogout && user && (
            <Button
              text="Sair"
              variant="secondary"
              onClick={handleLogout}
              className="btnHeader"
            />
          )}
        </nav>
      </div>
    </header>
  );
};
