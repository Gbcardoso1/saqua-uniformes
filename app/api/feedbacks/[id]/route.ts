import { createClient as createServiceClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

function getServiceClient() {
  const supabaseUrl = process.env.SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY
  if (!supabaseUrl || !serviceRoleKey) throw new Error("Supabase service credentials are not configured")
  return createServiceClient(supabaseUrl, serviceRoleKey)
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = getServiceClient()
    const { id } = await params

    const { error } = await supabase
      .from("feedbacks")
      .delete()
      .eq("id", id)

    if (error) {
      console.error("Error deleting feedback:", error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
