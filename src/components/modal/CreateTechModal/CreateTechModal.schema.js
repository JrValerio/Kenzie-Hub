import { z } from 'zod';

export const techSchema = z.object({
  title: z.string().min(1, 'O campo "Tecnologia" é obrigatório'),
  status: z.string().min(1, 'O campo "Status" é obrigatório'),
});
