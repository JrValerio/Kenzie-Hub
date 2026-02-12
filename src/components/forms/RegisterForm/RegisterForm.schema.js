import { z } from "zod";

export const registerFormSchema = z
  .object({
    name: z.string().min(4, "O campo Nome e obrigatorio!"),
    email: z
      .string()
      .min(1, "O campo Email e obrigatorio!")
      .email("Email invalido!"),
    password: z
      .string()
      .min(8, "A senha deve ter pelo menos 8 caracteres")
      .regex(/[a-z]/, "A senha deve conter pelo menos uma letra minuscula")
      .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiuscula")
      .regex(/[0-9]/, "A senha deve conter pelo menos um numero")
      .nonempty("O campo Senha e obrigatorio!")
      .regex(
        /[!@#$%^&*()_+{}[\]:;<>,.?~\\-]+/,
        "E necessario pelo menos um caracter especial."
      ),
    confirmPassword: z
      .string()
      .min(1, "O campo Confirmar Senha e obrigatorio!"),
    bio: z.string().min(1, "O campo Bio e obrigatorio!"),
    contact: z.string().min(1, "O campo Contato e obrigatorio!"),
    course_module: z
      .string()
      .min(1, "Selecionar o modulo do curso e obrigatorio!"),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    path: ["confirmPassword"],
    message: "As senhas nao correspondem.",
  });
