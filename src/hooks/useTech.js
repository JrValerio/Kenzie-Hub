import { useContext } from "react";
import { TechContext } from "../providers/TechContext";

export const useTech = () => {
  return useContext(TechContext);
};
