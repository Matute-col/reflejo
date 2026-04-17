import { NextResponse } from "next/server";
import { analyzeRequestSchema } from "@/lib/schemas/analyze-request";
import { runAnalysis } from "@/lib/ai/run-analysis";
import { parseAnalysis } from "@/lib/ai/parse-analysis";
import { buildProfile } from "@/lib/ai/build-profile";
import { buildNarrative } from "@/lib/ai/build-narrative";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const parsed = analyzeRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          message: "Payload inválido",
          errors: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const rawAnalysis = await runAnalysis(parsed.data.answers);
    const parsedAnalysis = parseAnalysis(rawAnalysis);

    if (!parsedAnalysis) {
      return NextResponse.json(
        {
          ok: false,
          message: "La IA respondió, pero el formato no fue válido",
          rawAnalysis,
        },
        { status: 502 }
      );
    }

    const finalProfile = buildProfile(parsedAnalysis);
    const finalResponse = buildNarrative(finalProfile);

    const quality = {
      details: parsedAnalysis.answerReview,
      totalAnswers: parsedAnalysis.answerReview.length,
      usefulAnswers: parsedAnalysis.usefulAnswersCount,
      discardedAnswers: parsedAnalysis.discardedAnswersCount,
      enoughForAnalysis: parsedAnalysis.enoughForAnalysis,
    };

    console.log("📩 Payload validado en backend:", parsed.data);
    console.log("🤖 Respuesta cruda de IA:", rawAnalysis);
    console.log("✅ Análisis parseado:", parsedAnalysis);
    console.log("🪞 Perfil final:", finalProfile);
    console.log("📊 Calidad semántica:", quality);
    console.log("✨ Respuesta final:", finalResponse);

    return NextResponse.json({
      ok: true,
      message: parsedAnalysis.enoughForAnalysis
        ? "Respuesta final estructurada correctamente"
        : "No hubo suficiente material útil para construir una lectura final",
      received: parsed.data,
      quality,
      rawAnalysis,
      parsedAnalysis,
      finalProfile,
      finalResponse,
    });
  } catch (error) {
    console.error("❌ Error en la ruta API:", error);

    return NextResponse.json(
      {
        ok: false,
        message: "Error procesando la solicitud",
      },
      { status: 500 }
    );
  }
}