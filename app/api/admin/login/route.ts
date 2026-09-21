import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const { username, password } = await request.json()
  const configuredUsername = process.env.ADMIN_USERNAME?.trim()
  const configuredPassword = process.env.ADMIN_PASSWORD?.trim()
  const valid = username?.trim() === configuredUsername && password === configuredPassword
  if (!valid) return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 })

  const response = NextResponse.json({ ok: true })
  const isHttps = new URL(request.url).protocol === "https:"
  response.cookies.set("admin_session", "authenticated", {
    httpOnly: true,
    secure: isHttps,
    sameSite: isHttps ? "none" : "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  })
  return response
}
