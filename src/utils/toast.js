import { toast } from "react-toastify";

export const showToast = (message, type, options = {}) => {
  toast[type](message, {
    autoClose: options.autoClose || 5000,
    position: options.position || "top-right",
    closeOnClick:
      options.closeOnClick !== undefined ? options.closeOnClick : true,
    style: {
      backgroundColor: options.color,
      fontSize: "12px",
    },
  });
};
