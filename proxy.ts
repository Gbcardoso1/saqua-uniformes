import { NextResponse, type NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request })
  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            response = NextResponse.next({ request })
            response.cookies.set(name, value, options)
          })
        },
      },
    },
  )

  const { data: { user } } = await supabase.auth.getUser()
  const isProtectedPath = request.nextUrl.pathname === "/admin" || request.nextUrl.pathname.startsWith("/api/submissions") || request.nextUrl.pathname.startsWith("/api/feedbacks")

  const isPublicSubmission = request.method === "POST" && request.nextUrl.pathname.startsWith("/api/")

  if (isProtectedPath && !isPublicSubmission && !user) {
    if (request.nextUrl.pathname === "/admin") {
      return NextResponse.redirect(new URL("/", request.url))
    }
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  return response
}

export const config = {
  matcher: ["/admin", "/api/submissions/:path*", "/api/feedbacks/:path*"],
}
