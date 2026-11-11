import { NextResponse } from "next/server";
import { config } from "@/config";
import { checkBackendHealth } from "@/lib/health-proxy";

// Siempre consulta en vivo: un resultado cacheado mentiría sobre el estado actual.
export const dynamic = "force-dynamic";

export async function GET() {
  const result = await checkBackendHealth({ backendUrl: config.backendUrl });
  return NextResponse.json(result, {
    status: result.status === "ok" ? 200 : 503,
    headers: { "cache-control": "no-store" },
  });
}
