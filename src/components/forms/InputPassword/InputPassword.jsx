import { forwardRef, useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import "../../../styles/input.scss";

export const InputPassword = forwardRef(({ label, error, ...rest }, ref) => {
  const [isHidden, setIsHidden] = useState(true);

  const type = isHidden ? "password" : "text";

  return (
    <div className="inputContent">
      <label className="label">
        {label === "password" ? "Senha" : "Confirmar Senha"}
      </label>
      <div className="inputGrid">
        <input ref={ref} {...rest} className="inputForm" type={type} />
        {error && <span className="error">{error}</span>}
        <button type="button" onClick={() => setIsHidden(!isHidden)}>
          {isHidden ? <FaRegEye size={19} /> : <FaRegEyeSlash size={19} />}
        </button>
      </div>
    </div>
  );
});
