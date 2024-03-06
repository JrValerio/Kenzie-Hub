import { Link } from "react-router-dom";
import "../../../styles/button.scss";

export const Button = ({ link, text, variant, type, ...props }) => {
  const btnForm = `btn--${variant}`;

  if (link) {
    return (
      <Link to={link}>
        <button className={btnForm} {...props}>
          {text}
        </button>
      </Link>
    );
  }

  return (
    <button type={type} className={btnForm} {...props}>
      {text}
    </button>
  );
};
