import { createContext } from "react";
import PropTypes from "prop-types";
import {
  addTech as apiAddTech,
  updateTech as apiUpdateTech,
  deleteTech as apiDeleteTech,
} from "../services/API";
import { showToast } from "../utils/toast";
import { useAuth } from "../hooks/useAuth";

export const TechContext = createContext();

export const TechProvider = ({ children }) => {
  const { setTechListData } = useAuth();

  const addTech = async (newTech) => {
    try {
      const response = await apiAddTech(newTech);
      setTechListData((previousTechs) => [...previousTechs, response]);
      showToast("Tecnologia adicionada com sucesso!", "success");
      return true;
    } catch (error) {
      console.error("Erro ao adicionar tecnologia:", error);
      showToast(error.message || "Erro ao adicionar tecnologia.", "error");
      return false;
    }
  };

  const deleteTech = async (techId) => {
    try {
      await apiDeleteTech(techId);
      setTechListData((previousTechs) =>
        previousTechs.filter((tech) => tech.id !== techId)
      );
      showToast("Tecnologia excluída com sucesso!", "success");
      return true;
    } catch (error) {
      console.error("Erro ao excluir tecnologia:", error);
      showToast(error.message || "Erro ao excluir tecnologia.", "error");
      return false;
    }
  };

  const updateTech = async (techId, updatedTech) => {
    try {
      const response = await apiUpdateTech(techId, updatedTech);
      setTechListData((previousTechs) =>
        previousTechs.map((tech) =>
          tech.id === techId ? { ...tech, ...response } : tech
        )
      );
      showToast("Tecnologia atualizada com sucesso!", "success");
      return true;
    } catch (error) {
      console.error("Erro ao atualizar tecnologia:", error);
      showToast(error.message || "Erro ao atualizar tecnologia.", "error");
      return false;
    }
  };

  return (
    <TechContext.Provider
      value={{
        addTech,
        deleteTech,
        updateTech,
      }}
    >
      {children}
    </TechContext.Provider>
  );
};

TechProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
