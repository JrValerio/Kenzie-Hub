import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { InputForm } from "../InputForm/InputForm";
import { InputPassword } from "../InputPassword/InputPassword";
import { loginFormSchema } from "./LoginForm.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../Button/Button";
import { useAuth } from "../../../providers/AuthContext";
import { showToast } from "../../Toasts/Toasts";
import "../../../styles/form.scss";

export const LoginForm = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (formData) => {
    try {
      await signIn(formData);
      showToast("Login realizado com sucesso!", "success");
      navigate("/user");
    } catch (error) {
      showToast(error.message || "Erro ao fazer login", "error");
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginFormSchema),
  });

  const showErrorsAsToasts = () => {
    Object.values(errors).forEach((error) => {
      showToast(error.message, "error");
    });
  };

  return (
    <form className="formContainer" onSubmit={handleSubmit(onSubmit, showErrorsAsToasts)}>
      <InputForm
        label={"Email"}
        placeholder="Digite aqui seu email"
        type="email"
        {...register("email")}
        error={errors.email?.message}
      />
      <InputPassword
        label="password"
        placeholder="Digite aqui sua senha"
        type="password"
        {...register("password")}
        error={errors.password?.message}
      />
      <Button variant="primary" text="Entrar" type="submit" />
    </form>
  );
};
