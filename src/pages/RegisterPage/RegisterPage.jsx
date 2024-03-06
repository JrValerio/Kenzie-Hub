import { DefaultTemplate } from "../../components/DefaultTemplate/DefaultTemplate";
import { Header } from "../../components/Header/Header";
import { RegisterForm } from "../../components/forms/RegisterForm/RegisterForm";
import "../../styles/global.scss";
import "../../styles/typography.scss";

export const RegisterPage = () => {
  return (
    <DefaultTemplate>
      <Header showBack />
      <main className="registerContainer">
        <div className="registerContent">
          <div className="registerInfo">
            <h1 className="title1">Crie sua conta</h1>
            <p className="prompt">Rápido e grátis, vamos nessa!</p>
          </div>
          <RegisterForm />
        </div>
      </main>
    </DefaultTemplate>
  );
};
