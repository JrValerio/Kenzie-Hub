import { DefaultTemplate } from "../../components/DefaultTemplate/DefaultTemplate";
import { Header } from "../../components/Header/Header";
import styles from "./ErrorPage.module.scss";

export const ErrorPage = () => {
  return (
    <DefaultTemplate>
      <Header />
      <main className={styles.errorPage}>
        <h1>Error 404</h1>
        <p>Página ou conteúdo não encontrado.</p>
      </main>
    </DefaultTemplate>
  );
};
