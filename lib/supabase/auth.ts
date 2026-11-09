import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function requireAuthenticatedUser() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  return user
}
