import { useForm } from "react-hook-form";
import { InputForm } from "../InputForm/InputForm";
import { InputPassword } from "../InputPassword/InputPassword";
import { loginFormSchema } from "./LoginForm.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../Button/Button";
import { useAuth } from "../../../hooks/useAuth";
import { showToast } from "../../../utils/toast";
import "../../../styles/form.scss";

export const LoginForm = () => {
  const { login } = useAuth();

  const onSubmit = async (formData) => {
    await login(formData);
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
    <form
      className="formContainer"
      onSubmit={handleSubmit(onSubmit, showErrorsAsToasts)}
    >
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
