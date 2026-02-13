import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import PropTypes from "prop-types";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { TECH_STATUS_OPTIONS } from "../../../constants/techStatus";
import { availableTechs } from "../../../data/DataBase";
import { useTech } from "../../../hooks/useTech";
import { techSchema } from "./CreateTechModal.schema";
import "../../../styles/modal.scss";
import "../../../styles/input.scss";
import "../../../styles/typography.scss";

export const CreateTechModal = ({ open, onClose }) => {
  const { addTech } = useTech();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(techSchema),
  });

  const onSubmit = async (newTech) => {
    const wasCreated = await addTech(newTech);

    if (wasCreated) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} className="modalStyle">
      <DialogTitle>
        Cadastrar Tecnologia
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

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <FormControl fullWidth margin="normal" className="noAnimation">
            <label htmlFor="tech-title" className="fieldStyle">
              Nome
            </label>
            <Select
              {...register("title", {
                required: "O campo Tecnologia e obrigatorio",
              })}
              labelId="tech-title-label"
              id="title"
              name="title"
              className="valueStyle noAnimation"
            >
              {availableTechs.map((tech) => (
                <MenuItem key={tech.id} value={tech.title} className="valueStyle">
                  {tech.title}
                </MenuItem>
              ))}
            </Select>
            {errors.title && <span className="error">{errors.title.message}</span>}
          </FormControl>

          <FormControl fullWidth margin="normal">
            <label htmlFor="tech-status" className="fieldStyle">
              Selecionar Status
            </label>
            <Select
              {...register("status", {
                required: "O campo Status e obrigatorio",
              })}
              labelId="status-label"
              id="status"
              name="status"
              className="valueStyle noAnimation"
            >
              {TECH_STATUS_OPTIONS.map((option) => (
                <MenuItem key={option} value={option} className="valueStyle">
                  {option}
                </MenuItem>
              ))}
            </Select>
            {errors.status && <span className="error">{errors.status.message}</span>}
          </FormControl>
        </DialogContent>

        <DialogActions>
          <button type="submit" className="buttonStyle">
            Cadastrar Tecnologia
          </button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

CreateTechModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
