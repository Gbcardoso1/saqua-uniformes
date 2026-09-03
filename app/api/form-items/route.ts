import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  const supabase = await createClient()
  const { data, error } = await supabase.from("form_items").select("*").eq("is_active", true).order("form_type").order("group_name").order("sort_order")
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ items: data ?? [] })
}

export async function POST(request: Request) {
  const body = await request.json()
  const supabase = await createClient()
  const payload = { form_type: String(body.form_type || "almoxarifado"), group_name: String(body.group_name || "Geral"), label: String(body.label || "").trim(), sort_order: Number(body.sort_order || 0), is_active: true }
  if (!payload.label || payload.label.length > 180) return NextResponse.json({ error: "Nome inválido" }, { status: 400 })
  const { data, error } = await supabase.from("form_items").insert(payload).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ item: data })
}

export async function PATCH(request: Request) {
  const body = await request.json()
  const supabase = await createClient()
  const updates = { label: String(body.label || "").trim(), group_name: String(body.group_name || "Geral"), sort_order: Number(body.sort_order || 0), is_active: body.is_active !== false, updated_at: new Date().toISOString() }
  if (!body.id || !updates.label) return NextResponse.json({ error: "Dados inválidos" }, { status: 400 })
  const { data, error } = await supabase.from("form_items").update(updates).eq("id", body.id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ item: data })
}

export async function DELETE(request: Request) {
  const id = new URL(request.url).searchParams.get("id")
  if (!id) return NextResponse.json({ error: "ID obrigatório" }, { status: 400 })
  const supabase = await createClient()
  const { error } = await supabase.from("form_items").update({ is_active: false, updated_at: new Date().toISOString() }).eq("id", id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
