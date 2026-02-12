import { useState } from "react";
import { TechCard } from "../TechCard/TechCard";
import plus from "../../../assets/ButtonPlus.svg";
import { CreateTechModal } from "../../modal/CreateTechModal/CreateTechModal";
import { useAuth } from "../../../hooks/useAuth";

export const TechList = () => {
  const { techListData } = useAuth();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  return (
    <div className="techListContainer">
      <div className="techListTitle">
        <h2 className="title2">Tecnologias</h2>
        <button onClick={handleOpenCreateModal}>
          <img src={plus} alt="Adicionar tecnologia" />
        </button>
      </div>
      {techListData.length > 0 ? (
        <ul className="techListContent">
          {techListData.map((tech) => (
            <li key={tech.id}>
              <TechCard tech={tech} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="techListMessage">
          <h1 className="title2">Nenhuma tecnologia cadastrada</h1>
          <p className="paragraph">
            Clique no botão acima para adicionar a sua primeira tecnologia!
          </p>
        </div>
      )}
      {isCreateModalOpen && (
        <CreateTechModal
          open={isCreateModalOpen}
          onClose={handleCloseCreateModal}
        />
      )}
    </div>
  );
};
