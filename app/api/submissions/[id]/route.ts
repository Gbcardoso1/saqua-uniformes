import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { error: movementError } = await supabase.from("movement_submissions").delete().eq("id", id)
    const { error: regularError } = await supabase.from("submissions").delete().eq("id", id)
    const error = movementError && regularError ? movementError : null

    if (error) {
      console.error("Error deleting submission:", error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in DELETE:", error)
    return NextResponse.json({ success: false, error: "Failed to delete submission" }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const supabase = await createClient()

    const updateData: Record<string, unknown> = {}

    if (body.status !== undefined) {
      updateData.status = body.status
    }
    if (body.feedback !== undefined) {
      updateData.movement_feedback = body.feedback || null
    }
    if (body.status === "aprovado" || body.status === "refazer") {
      updateData.movement_reviewed_at = new Date().toISOString()
    }

    const { data: movementData, error: movementError } = await supabase
      .from("movement_submissions")
      .update(updateData)
      .eq("id", id)
      .select()
    const { data: regularData, error: regularError } = movementData?.length
      ? { data: [], error: null }
      : await supabase.from("submissions").update(updateData).eq("id", id).select()
    const data = movementData?.length ? movementData : regularData
    const error = movementData?.length ? movementError : regularError

    if (error) {
      console.error("Error updating submission:", error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ 
        success: true, 
        submission: {
          id: id,
          status: body.status,
          feedback: body.feedback,
        }
      })
    }

    return NextResponse.json({ 
      success: true, 
      submission: {
        id: data[0].id,
        status: data[0].status,
      }
    })
  } catch (error) {
    console.error("Error in PATCH:", error)
    return NextResponse.json({ success: false, error: "Failed to update submission" }, { status: 500 })
  }
}
