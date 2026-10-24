import { createFileRoute } from "@tanstack/react-router";
import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { z } from "zod";
import {
  createLovableAiGatewayRunIdFetch,
  getLovableAiGatewayRunId,
  withLovableAiGatewayRunIdHeader,
} from "@/server/run-id";

const Missed = z.object({
  q: z.string().max(400),
  picked: z.string().max(300),
  correct: z.string().max(300),
});

const Body = z.discriminatedUnion("mode", [
  z.object({ mode: z.literal("explain"), track: z.string().max(60), item: Missed }),
  z.object({
    mode: z.literal("plan"),
    track: z.string().max(60),
    score: z.number().int().min(0).max(200),
    total: z.number().int().min(1).max(200),
    missed: z.array(Missed).max(40),
  }),
]);

const INSTRUCTIONS = `You are the JOBZ.BAR Bar Coach, a friendly senior bar trainer in India.
You coach bartenders, bar managers and brand people. Plain English, short sentences, Indian bar context (45ml/60ml pours, Indian brands, excise basics) where helpful.
Never invent laws or prices. Use simple markdown: short bold labels and bullet lists only. No tables, no headings bigger than bold text.`;

export const Route = createFileRoute("/api/coach")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const key = process.env["LOVABLE_API_KEY"];
        if (!key) return Response.json({ error: "AI coach is not configured." }, { status: 500 });
        let body: z.infer<typeof Body>;
        try {
          body = Body.parse(await request.json());
        } catch {
          return Response.json({ error: "Invalid request." }, { status: 400 });
        }

        const prompt =
          body.mode === "explain"
            ? `Track: ${body.track}\nQuestion: ${body.item.q}\nLearner picked: ${body.item.picked}\nCorrect answer: ${body.item.correct}\n\nIn under 90 words: 1) why their pick is a common mix-up, 2) why the correct answer is right, 3) one memory trick they can use on shift tomorrow.`
            : `Track: ${body.track}\nScore: ${body.score}/${body.total}\nQuestions they got wrong:\n${
                body.missed.map((m, i) => `${i + 1}. ${m.q} (picked "${m.picked}", correct "${m.correct}")`).join("\n") || "None"
              }\n\nWrite a personal 7-day learning plan in under 220 words: **Where you're stuck** (2-3 themes grouped from the misses), **Your 7 days** (one 10-minute task per day, practical, behind-the-bar), **Ask your mentor** (one question to take to a human senior bartender).`;

        const runIdFetch = createLovableAiGatewayRunIdFetch(getLovableAiGatewayRunId(request));
        const provider = createOpenAI({
          baseURL: "https://ai.gateway.lovable.dev/v1",
          apiKey: key,
          headers: { "Lovable-API-Key": key, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
          fetch: runIdFetch.fetch,
        });
        const result = streamText({
          model: provider.responses("openai/gpt-6-astra"),
          instructions: INSTRUCTIONS,
          prompt,
          abortSignal: request.signal,
          providerOptions: {
            openai: {
              store: false,
              forceReasoning: true,
              reasoningEffort: "low",
              reasoningSummary: "auto",
              include: ["reasoning.encrypted_content"],
            },
          },
        });
        return withLovableAiGatewayRunIdHeader(result.toTextStreamResponse(), runIdFetch);
      },
    },
  },
});
