import { z } from "zod";

export const registerFormSchema = z
  .object({
    name: z.string().min(4, "Este campo é obrigatório!"),
    email: z
      .string()
      .min(1, "Este campo é obrigatório!")
      .email("Email inválido!"),
    password: z
      .string()
      .min(8, "A senha deve ter pelo menos 8 caracteres")
      .regex(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula")
      .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
      .regex(/[0-9]/, "A senha deve conter pelo menos um número")
      .nonempty("A senha é obrigatória!")
      .regex(
        /[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]+/,
        "É necessário pelo menos um caracter especial."
      ),
    confirmPassword: z.string().min(1, "Este campo é obrigatório!"),
    bio: z.string().min(1, "Bio é obrigatório!"),
    contact: z.string().min(1, "Contato é obrigatório!"),
    course_module: z.string().min(1, "Módulo do curso é obrigatório!"),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: "As senhas não correspondem.",
  });
