import { DefaultTemplate } from "../../components/DefaultTemplate/DefaultTemplate";
import { RegisterHeader } from "../../components/Header/RegisterHeader";
import { RegisterForm } from "../../components/forms/RegisterForm/RegisterForm";
import "../../styles/global.scss";
import "../../styles/typography.scss";

export const RegisterPage = () => {
  return (
    <DefaultTemplate>
      <RegisterHeader />
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
