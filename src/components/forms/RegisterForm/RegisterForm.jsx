import { useForm } from "react-hook-form";
import { InputForm } from "../InputForm/InputForm";
import { InputPassword } from "../InputPassword/InputPassword";
import { registerFormSchema } from "./RegisterForm.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import "../../../styles/typography.scss";
import "../../../styles/input.scss";
import { Button } from "../Button/Button";
import { showToast } from "../../Toasts/Toasts";
import { useAuth } from "../../../providers/AuthContext";

export const RegisterForm = () => {
  const { register: registerUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerFormSchema),
  });

  const onSubmit = async (formData) => {
    await registerUser(formData);
  };

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
        label="Nome"
        placeholder="Digite seu nome"
        type="text"
        {...register("name")}
        error={errors.name?.message}
      />
      <InputForm
        label="Email"
        placeholder="Digite seu email"
        type="email"
        {...register("email")}
        error={errors.email?.message}
      />
      <InputPassword
        label="password"
        placeholder="Digite sua senha"
        type="password"
        {...register("password")}
        error={errors.password?.message}
      />
      <InputPassword
        label="confirmPassword"
        placeholder="Confirme sua senha"
        type="password"
        {...register("confirmPassword")}
        error={errors.confirmPassword?.message}
      />
      <InputForm
        label="Bio"
        placeholder="Fale sobre você"
        type="text"
        {...register("bio")}
        error={errors.bio?.message}
      />
      <InputForm
        label="Contato"
        placeholder="Opção de contato"
        type="text"
        {...register("contact")}
        error={errors.contact?.message}
      />
      <div className="selectModule">
        <label className="label">Selecionar Módulo</label>
        <select {...register("course_module")}>
          <option value="">Selecionar Módulo</option>
          <option value="Primeiro Módulo">Primeiro Módulo</option>
          <option value="Segundo Módulo">Segundo Módulo</option>
          <option value="Terceiro Módulo">Terceiro Módulo</option>
          <option value="Quarto Módulo">Quarto Módulo</option>
          <option value="Quinto Módulo">Quinto Módulo</option>
          <option value="Sexto Módulo">Sexto Módulo</option>
        </select>
        {errors.course_module && (
          <span className="error">{errors.course_module.message}</span>
        )}
      </div>
      <Button type="submit" text="Cadastrar" variant="negative" />
    </form>
  );
};
