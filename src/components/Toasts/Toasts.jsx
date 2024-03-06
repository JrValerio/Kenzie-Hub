import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const showToast = (message, type, options = {}) => {
  toast[type](message, {
    autoClose: options.autoClose || 3000,
    position: options.position || "top-right",
    closeOnClick:
      options.closeOnClick !== undefined ? options.closeOnClick : true,
    style: { 
      backgroundColor: options.color,
      fontSize: '12px',
    },
  });
};

export const Toasts = () => {
  return (
    <ToastContainer
      theme="dark"
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
  );
};
