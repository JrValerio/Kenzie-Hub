import { forwardRef } from "react";
import PropTypes from "prop-types";
import "../../../styles/input.scss";
import "../../../styles/typography.scss";

export const InputForm = forwardRef(({ label, error, ...rest }, ref) => {
  return (
    <div className="inputContent">
      <label className="label">{label}</label>
      <input ref={ref} {...rest} className="inputForm" />
      {error && <span className="error">{error}</span>}
    </div>
  );
});

InputForm.displayName = "InputForm";

InputForm.propTypes = {
  label: PropTypes.string.isRequired,
  error: PropTypes.string,
};
