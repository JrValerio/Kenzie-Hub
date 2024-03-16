import { DefaultTemplate } from "../../components/DefaultTemplate/DefaultTemplate";
import { UserHeader } from "../../components/Header/UserHeader";
import { TechList } from "../../components/technologies/TechList/TechList";
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



