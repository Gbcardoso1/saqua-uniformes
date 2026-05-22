import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

type Submission = {
  id: string
  timestamp: string
  name: string
  matricula: string
  institution: string
  submissionType?: string
  uniforms: Array<{
    type: string
    gender: string
    size: string
    quantity: string
  }>
  shoes: Array<{
    size: string
    quantity: string
  }>
  studentKits?: Array<{
    size: string
    quantity: string
  }>
  teacherPolos?: Array<{
    size: string
    quantity: string
  }>
  backpacks?: Array<{
    size: string
    quantity: string
  }>
  stationeryItems?: Array<{
    item: string
    quantity: string
  }>
  crecheItems?: Array<{
    item: string
    quantity: string
  }>
  status?: string
}

export async function GET() {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase.from("submissions").select("*").order("submitted_at", { ascending: false })

    if (error) {
      console.error("Error fetching submissions:", error)
      return NextResponse.json({ submissions: [] })
    }

    // Transform database format to match frontend expectations
    const submissions: Submission[] = data.map((item) => ({
      id: item.id,
      timestamp: item.submitted_at,
      name: item.requester_name,
      matricula: item.registration,
      institution: item.institution,
      submissionType: item.submission_type || "uniformes",
      uniforms: item.uniforms || [],
      shoes: item.shoes || [],
      studentKits: item.student_kits || [],
      teacherPolos: item.teacher_polos || [],
      backpacks: item.backpacks || [],
      stationeryItems: item.stationery_items || [],
      crecheItems: item.creche_items || [],
      status: item.status || "pendente",
    }))

    return NextResponse.json({ submissions })
  } catch (error) {
    console.error("Error in GET:", error)
    return NextResponse.json({ submissions: [] })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const supabase = await createClient()

    const { data: insertedData, error } = await supabase
      .from("submissions")
      .insert({
        requester_name: data.name,
        registration: data.matricula,
        institution: data.institution,
        submission_type: data.submissionType || "uniformes",
        uniforms: data.uniforms || [],
        shoes: data.shoes || [],
        student_kits: data.studentKits || [],
        teacher_polos: data.teacherPolos || [],
        backpacks: data.backpacks || [],
        stationery_items: data.stationeryItems || [],
        creche_items: data.crecheItems || [],
      })
      .select()
      .single()

    if (error) {
      console.error("Error inserting submission:", error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    const submission: Submission = {
      id: insertedData.id,
      timestamp: insertedData.submitted_at,
      name: insertedData.requester_name,
      matricula: insertedData.registration,
      institution: insertedData.institution,
      submissionType: insertedData.submission_type,
      uniforms: insertedData.uniforms || [],
      shoes: insertedData.shoes || [],
      studentKits: insertedData.student_kits || [],
      teacherPolos: insertedData.teacher_polos || [],
      backpacks: insertedData.backpacks || [],
      stationeryItems: insertedData.stationery_items || [],
      crecheItems: insertedData.creche_items || [],
    }

    return NextResponse.json({ success: true, submission })
  } catch (error) {
    console.error("Error in POST:", error)
    return NextResponse.json({ success: false, error: "Failed to save submission" }, { status: 500 })
  }
}
