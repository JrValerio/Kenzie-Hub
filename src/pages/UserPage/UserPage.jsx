import { DefaultTemplate } from "../../components/DefaultTemplate/DefaultTemplate";
import { Header } from "../../components/Header/Header";
import { useAuth } from "../../providers/AuthContext";
import { useNavigate } from "react-router-dom";

export const UserPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate("/");
    return null;
  }

  return (
    <DefaultTemplate>
      <Header showLogout={true} isUserPage={true} />
      <main className="userContainer">
        <div className="userInfo">
          <h1 className="title1">Olá, {user.name}</h1>
          <p className="prompt">Primeiro módulo (Introdução ao Frontend)</p>
        </div>
        <h1 className="title1">Que pena! Estamos em desenvolvimento :(</h1>
        <p className="paragraph">
          Nossa aplicação está em desenvolvimento, em breve teremos novidades
        </p>
      </main>
    </DefaultTemplate>
  );
};


