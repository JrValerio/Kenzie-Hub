import { z } from "zod";

export const loginFormSchema = z.object({
  email: z.string().min(1, "O campo Email é obrigatório!"),
  password: z.string().nonempty("O campo Senha é obrigatório!"),
});
