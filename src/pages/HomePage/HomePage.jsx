import { Button } from "../../components/forms/Button/Button";
import { LoginForm } from "../../components/forms/LoginForm/LoginForm";
import { DefaultTemplate } from "../../components/DefaultTemplate/DefaultTemplate";
import { Header } from "../../components/Header/Header";
import "../../styles/global.scss";
import "../../styles/typography.scss";
import "../../styles/container.scss";

export const HomePage = () => {
  return (
    <DefaultTemplate>
      <Header />
      <main className="loginContainer">
        <div className="loginContent">
          <h1 className="title1">Login</h1>
          <LoginForm />
          <p className="prompt">Ainda não possui uma conta?</p>
          <Button variant="secondary" text="Cadastre-se" link="/register" />
        </div>
      </main>
    </DefaultTemplate>
  );
};
