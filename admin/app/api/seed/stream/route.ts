import { NextRequest } from "next/server";
import { runFullSeed } from "@/app/(dashboard)/settings/seed/actions/seed-core";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface LogEntry {
  message: string;
  level: "info" | "success" | "error";
  timestamp: string;
}

function createSSEStream(
  articleCount: number,
  useOpenAI: boolean
) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: LogEntry) => {
        const message = `data: ${JSON.stringify(data)}\n\n`;
        try {
          controller.enqueue(encoder.encode(message));
        } catch (error) {
          console.error("Error sending SSE message:", error);
        }
      };

      const logCallback = (message: string, level: "info" | "success" | "error" = "info") => {
        send({
          message,
          level,
          timestamp: new Date().toISOString(),
        });
        console.log(message);
      };

      try {
        send({
          message: "Starting seed process...",
          level: "info",
          timestamp: new Date().toISOString(),
        });

        const summary = await runFullSeed({
          articleCount,
          useOpenAI,
          logCallback,
        });

        send({
          message: `✅ Seed completed successfully! Created ${summary.articles.total} articles (${summary.articles.published} published, ${summary.articles.draft} draft).`,
          level: "success",
          timestamp: new Date().toISOString(),
        });

        send({
          message: "[COMPLETE]",
          level: "success",
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error occurred";
        send({
          message: `❌ Error: ${errorMessage}`,
          level: "error",
          timestamp: new Date().toISOString(),
        });
      } finally {
        controller.close();
      }
    },
  });

  return stream;
}

export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV !== "development") {
    return new Response(
      JSON.stringify({ error: "This endpoint is only available in development" }),
      {
        status: 403,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const searchParams = request.nextUrl.searchParams;
  const articleCount = parseInt(searchParams.get("articleCount") || "70", 10);
  const useOpenAI = searchParams.get("useOpenAI") === "true";

  if (isNaN(articleCount) || articleCount < 10 || articleCount > 300) {
    return new Response(
      JSON.stringify({ error: "Invalid article count (must be 10-300)" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const stream = createSSEStream(articleCount, useOpenAI);

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
