import logo from "../../assets/KenzieHub.svg";
import { Button } from "../forms/Button/Button";
import styles from "./Header.module.scss";
import { useNavigate } from "react-router-dom";

export const RegisterHeader = () => {
  const navigate = useNavigate();

  return (
    <header className={styles.registerHeader}>
      <div className={styles.headerContent}>
        <img src={logo} alt="Logo Kenzie Hub" />
        <Button text="Voltar" variant="small" onClick={() => navigate(-1)} />
      </div>
    </header>
  );
};
