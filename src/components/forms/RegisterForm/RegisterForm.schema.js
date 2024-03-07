import { z } from "zod";

export const registerFormSchema = z
  .object({
    name: z.string().min(4, "O campo Nome é obrigatório!"),
    email: z
      .string()
      .min(1, "O campo Email é obrigatório!")
      .email("Email inválido!"),
    password: z
      .string()
      .min(8, "A senha deve ter pelo menos 8 caracteres")
      .regex(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula")
      .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
      .regex(/[0-9]/, "A senha deve conter pelo menos um número")
      .nonempty("O campo Senha é obrigatório!")
      .regex(
        /[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]+/,
        "É necessário pelo menos um caracter especial."
      ),
    confirmPassword: z.string().min(1, "O campo Confirmar Senha é obrigatório!"),
    bio: z.string().min(1, "O campo Bio é obrigatório!"),
    contact: z.string().min(1, "O campo Contato é obrigatório!"),
    course_module: z.string().min(1, "Selecionar o Módulo do curso é obrigatório!"),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    path: ["confirmPassword"],
    message: "As senhas não correspondem.",
  });
