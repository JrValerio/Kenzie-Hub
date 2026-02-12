import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import "../../../styles/button.scss";

export const Button = ({ link, text, variant, type, ...props }) => {
  const btnForm = `btn--${variant}`;

  if (link) {
    return (
      <Link to={link} className={btnForm} {...props}>
        {text}
      </Link>
    );
  }

  return (
    <button type={type || "button"} className={btnForm} {...props}>
      {text}
    </button>
  );
};

Button.propTypes = {
  link: PropTypes.string,
  text: PropTypes.string.isRequired,
  variant: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
};

Button.defaultProps = {
  link: undefined,
  type: "button",
};
