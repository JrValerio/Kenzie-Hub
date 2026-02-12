import { DefaultTemplate } from "../../components/DefaultTemplate/DefaultTemplate";
import { UserHeader } from "../../components/Header/UserHeader";
import { TechList } from "../../components/technologies/TechList/TechList";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export const UserPage = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <DefaultTemplate>
      <UserHeader />
      <main className="userContainer">
        <div className="userInfo">
          <h1 className="title1">Olá, {user.name}</h1>
          <p className="prompt">{user.course_module}</p>
        </div>
        <TechList />
      </main>
    </DefaultTemplate>
  );
};



