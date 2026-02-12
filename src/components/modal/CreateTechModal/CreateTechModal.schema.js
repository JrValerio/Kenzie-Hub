import { z } from "zod";
import { TECH_STATUS_OPTIONS } from "../../../constants/techStatus";

export const techSchema = z.object({
  title: z.string().min(1, 'O campo "Tecnologia" e obrigatorio'),
  status: z.enum(TECH_STATUS_OPTIONS, {
    errorMap: () => ({ message: 'O campo "Status" e obrigatorio' }),
  }),
});
