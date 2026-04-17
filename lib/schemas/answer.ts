import { z } from "zod";

export const answerSchema = z.object({
  questionId: z
    .number()
    .int("El identificador de la pregunta debe ser un entero.")
    .positive("El identificador de la pregunta debe ser mayor que cero."),

  content: z
    .string()
    .trim()
    .min(2, "La respuesta es demasiado corta.")
    .max(500, "La respuesta no puede superar los 500 caracteres."),
});

export type AnswerInput = z.infer<typeof answerSchema>;