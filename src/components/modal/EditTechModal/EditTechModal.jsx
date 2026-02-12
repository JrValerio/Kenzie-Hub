import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import CloseIcon from "@mui/icons-material/Close";
import { TECH_STATUS_OPTIONS } from "../../../constants/techStatus";
import { useTech } from "../../../hooks/useTech";
import "../../../styles/modal.scss";

export const EditTechModal = ({ open, onClose, tech }) => {
  const { updateTech } = useTech();

  const [editTechData, setEditTechData] = useState({
    title: tech.title,
    status: tech.status,
  });

  useEffect(() => {
    setEditTechData({
      title: tech.title,
      status: tech.status,
    });
  }, [tech]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setEditTechData({ ...editTechData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await updateTech(tech.id, editTechData);
      onClose();
    } catch (error) {
      console.error("Erro ao editar tecnologia", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} className="modalStyle">
      <DialogTitle>
        Tecnologia Detalhes
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <FormControl fullWidth margin="normal" className="noAnimation">
            <label htmlFor="tech-title" className="fieldStyle">
              Nome
            </label>
            <Select
              labelId="tech-title-label"
              id="title"
              name="title"
              value={editTechData.title}
              onChange={handleChange}
              required
              className="valueStyle noAnimation"
              disabled
            >
              <MenuItem value={editTechData.title}>{editTechData.title}</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <label htmlFor="tech-status" className="fieldStyle">
              Selecionar Status
            </label>
            <Select
              labelId="status-label"
              id="status"
              name="status"
              value={editTechData.status}
              label="Status"
              onChange={handleChange}
              className="valueStyle noAnimation"
            >
              {TECH_STATUS_OPTIONS.map((option) => (
                <MenuItem key={option} value={option} className="valueStyle">
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>

        <DialogActions>
          <button type="submit" className="buttonStyle">
            Salvar alteracoes
          </button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

EditTechModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  tech: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
};
