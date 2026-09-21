import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const { username, password } = await request.json()
  const valid = username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD
  if (!valid) return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 })

  const response = NextResponse.json({ ok: true })
  response.cookies.set("admin_session", "authenticated", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  })
  return response
}
