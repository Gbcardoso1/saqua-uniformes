import { createClient as createServiceClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

function getServiceClient() {
  const supabaseUrl = process.env.SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY
  if (!supabaseUrl || !serviceRoleKey) throw new Error("Supabase service credentials are not configured")
  return createServiceClient(supabaseUrl, serviceRoleKey)
}

export async function GET() {
  try {
    const supabase = getServiceClient()
    
    const { data, error } = await supabase
      .from("feedbacks")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching feedbacks:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = getServiceClient()
    const body = await request.json()
    const { institution, category, message } = body

    if (!institution || !message) {
      return NextResponse.json(
        { error: "Institution and message are required" },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from("feedbacks")
      .insert({
        institution,
        category: category || "sugestao",
        message,
      })
      .select()
      .single()

    if (error) {
      console.error("Error inserting feedback:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = getServiceClient()
    const body = await request.json()
    const { id, status } = body

    if (!id || !status) {
      return NextResponse.json(
        { error: "ID and status are required" },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from("feedbacks")
      .update({ status })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error updating feedback:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
