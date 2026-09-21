import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
  const session = (await cookies()).get("admin_session")?.value
  return NextResponse.json({ authenticated: session === "authenticated" })
}
