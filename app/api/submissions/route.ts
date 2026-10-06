import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createClient as createServiceClient } from "@supabase/supabase-js"

type Submission = {
  id: string
  timestamp: string
  name: string
  matricula: string
  institution: string
  tmbpPmsNumber?: string
  submissionType?: string
  documentType?: "termo" | "inventario"
  uniforms: Array<{
    type: string
    gender: string
    size: string
    quantity: string
  }>
  shoes: Array<{
    size: string
    quantity: string
    type?: string
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
  kitchenItems?: Array<{
    item: string
    quantity: string
  }>
  crecheItems?: Array<{
    item: string
    quantity: string
  }>
  status?: string
  termFileName?: string
  movementFileName?: string
  fileName?: string
  feedback?: string
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
      tmbpPmsNumber: item.tmbp_pms_number || "",
      submissionType: item.submission_type || "uniformes",
      documentType: item.submission_type === "movimentacoes-inventario" ? "inventario" : item.submission_type?.startsWith("movimentacoes") ? "termo" : undefined,
      uniforms: item.uniforms || [],
      shoes: item.shoes || [],
      studentKits: item.student_kits || [],
      teacherPolos: item.teacher_polos || [],
      backpacks: item.backpacks || [],
      stationeryItems: item.stationery_items || [],
      kitchenItems: item.kitchen_items || [],
      crecheItems: item.creche_items || [],
      status: item.status || "pendente",
      termFileName: item.movement_file_name || undefined,
      movementFileName: item.movement_file_name || undefined,
      fileName: item.movement_file_name || "Arquivo anexado",
      feedback: item.movement_feedback || undefined,
      movementFileData: item.movement_file_data || undefined,
    }))

    return NextResponse.json({ submissions })
  } catch (error) {
    console.error("Error in GET:", error)
    return NextResponse.json({ submissions: [] })
  }
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || ""
    const data = contentType.includes("multipart/form-data") ? await request.formData() : await request.json()
    let movementFileData = contentType.includes("multipart/form-data") ? null : data.movementFileData || null
    let movementFileName = contentType.includes("multipart/form-data") ? null : data.movementFileName || null

    if (contentType.includes("multipart/form-data")) {
      const file = data.get("file")
      if (!(file instanceof File) || file.size === 0) {
        return NextResponse.json({ success: false, error: "Arquivo não recebido" }, { status: 400 })
      }
      const serviceSupabase = createServiceClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
      const filePath = `submissions/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`
      const { error: uploadError } = await serviceSupabase.storage.from("submission-files").upload(filePath, file, { contentType: file.type || "application/octet-stream", upsert: false })
      if (uploadError) throw uploadError
      const { data: publicFile } = serviceSupabase.storage.from("submission-files").getPublicUrl(filePath)
      movementFileData = publicFile.publicUrl
      movementFileName = file.name
    }

    const supabase = await createClient()

    const { data: insertedData, error } = await supabase
      .from("submissions")
      .insert({
        requester_name: contentType.includes("multipart/form-data") ? data.get("name") : data.name,
        registration: contentType.includes("multipart/form-data") ? data.get("matricula") : data.matricula,
        institution: contentType.includes("multipart/form-data") ? data.get("institution") : data.institution,
        tmbp_pms_number: (contentType.includes("multipart/form-data") ? data.get("tmbpPmsNumber") : data.tmbpPmsNumber) || null,
        submission_type: (contentType.includes("multipart/form-data") ? data.get("submissionType") : data.submissionType) || "uniformes",
        uniforms: data.uniforms || [],
        shoes: data.shoes || [],
        student_kits: data.studentKits || [],
        teacher_polos: data.teacherPolos || [],
        backpacks: data.backpacks || [],
        stationery_items: data.stationeryItems || [],
        kitchen_items: data.kitchenItems || [],
        creche_items: data.crecheItems || [],
        movement_file_name: movementFileName,
        movement_file_data: movementFileData,
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
      tmbpPmsNumber: insertedData.tmbp_pms_number || "",
      submissionType: insertedData.submission_type,
      documentType: insertedData.submission_type === "movimentacoes-inventario" ? "inventario" : insertedData.submission_type?.startsWith("movimentacoes") ? "termo" : undefined,
      uniforms: insertedData.uniforms || [],
      shoes: insertedData.shoes || [],
      studentKits: insertedData.student_kits || [],
      teacherPolos: insertedData.teacher_polos || [],
      backpacks: insertedData.backpacks || [],
      stationeryItems: insertedData.stationery_items || [],
      kitchenItems: insertedData.kitchen_items || [],
      crecheItems: insertedData.creche_items || [],
    }

    return NextResponse.json({ success: true, submission })
  } catch (error) {
    console.error("Error in POST:", error)
    return NextResponse.json({ success: false, error: "Failed to save submission" }, { status: 500 })
  }
}
