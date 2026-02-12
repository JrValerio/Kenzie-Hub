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
  const { techListData, setTechListData } = useAuth();

  const addTech = async (newTech) => {
    try {
      const response = await apiAddTech(newTech);
      const updatedTechList = [...techListData, response];
      setTechListData(updatedTechList);
      showToast("Tecnologia adicionada com sucesso!", "success");
    } catch (error) {
      console.error("Erro ao adicionar tecnologia:", error);
      showToast(error.message || "Erro ao adicionar tecnologia.", "error");
    }
  };

  const deleteTech = async (techId) => {
    try {
      await apiDeleteTech(techId);
      const updatedTechList = techListData.filter((tech) => tech.id !== techId);
      setTechListData(updatedTechList);
      showToast("Tecnologia excluída com sucesso!", "success");
    } catch (error) {
      console.error("Erro ao excluir tecnologia:", error);
      showToast(error.message || "Erro ao excluir tecnologia.", "error");
    }
  };

  const updateTech = async (techId, updatedTech) => {
    try {
      const response = await apiUpdateTech(techId, updatedTech);
      const updatedTechList = techListData.map((tech) =>
        tech.id === techId ? { ...tech, ...response } : tech
      );
      setTechListData(updatedTechList);
      showToast("Tecnologia atualizada com sucesso!", "success");
    } catch (error) {
      console.error("Erro ao atualizar tecnologia:", error);
      showToast(error.message || "Erro ao atualizar tecnologia.", "error");
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
