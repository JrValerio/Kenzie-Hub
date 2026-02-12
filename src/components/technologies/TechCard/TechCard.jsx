import { useState } from "react";
import PropTypes from "prop-types";
import { useTech } from "../../../hooks/useTech";
import { EditTechModal } from "../../modal/EditTechModal/EditTechModal";
import del from "../../../assets/delete.svg";
import edit from "../../../assets/edit.svg";

export const TechCard = ({ tech }) => {
  const { deleteTech } = useTech();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleDelete = () => {
    deleteTech(tech.id);
  };

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  return (
    <>
      <div className="techCardContainer">
        <h3 className="title3">{tech.title}</h3>
        <div className="techCardContent">
          <span className="prompt">{tech.status}</span>
          <div className="techListButton">
            <button onClick={handleEdit}>
              <img src={edit} alt="" />
            </button>
            <button onClick={handleDelete}>
              <img src={del} alt="" />
            </button>
          </div>
        </div>
      </div>
      {isEditModalOpen && (
        <EditTechModal
          open={isEditModalOpen}
          onClose={handleCloseEditModal}
          tech={tech}
        />
      )}
    </>
  );
};

TechCard.propTypes = {
  tech: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
};
