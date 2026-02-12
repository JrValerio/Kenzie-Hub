import PropTypes from "prop-types";

export const DefaultTemplate = ({ children }) => {
  return <>{children}</>;
};

DefaultTemplate.propTypes = {
  children: PropTypes.node.isRequired,
};
