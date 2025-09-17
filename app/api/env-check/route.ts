import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  return new NextResponse(
    JSON.stringify({
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL?.slice(0, 32) + "...",
      supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.slice(0, 6) + "...",
      serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(0, 6) + "...",
      timestamp: new Date().toISOString(),
    }),
    {
      headers: {
        "content-type": "application/json",
        "cache-control": "no-store, no-cache, must-revalidate, max-age=0",
      },
    }
  );
}
