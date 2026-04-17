import { z } from "zod";

export const analyzeRequestSchema = z.object({
  answers: z
    .record(z.string(), z.string())
    .refine((value) => Object.keys(value).length > 0, {
      message: "Debes enviar al menos una respuesta.",
    }),
});

export type AnalyzeRequestInput = z.infer<typeof analyzeRequestSchema>;