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
    const supabaseUrl = process.env.SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY
    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json({ submissions: [], error: "Configuração do banco indisponível" }, { status: 503 })
    }

    // O painel administrativo precisa ler todos os registros, sem depender
    // da sessão/cookies do navegador nem das políticas RLS públicas.
    const serviceSupabase = createServiceClient(supabaseUrl, serviceRoleKey)
    const [{ data: regularData, error: regularError }, { data: movementData, error: movementError }] = await Promise.all([
      serviceSupabase.from("submissions").select("*").order("submitted_at", { ascending: false }),
      serviceSupabase.from("movement_submissions").select("*").order("submitted_at", { ascending: false }),
    ])

    if (regularError || movementError) {
      console.error("Error fetching submissions:", regularError || movementError)
      return NextResponse.json({ submissions: [], error: "Não foi possível carregar as solicitações" }, { status: 500 })
    }

    // The admin panel receives both regular requests and inventory/movement requests.
    const data = [...(regularData || []), ...(movementData || [])].sort(
      (a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime(),
    )

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
      const supabaseUrl = process.env.SUPABASE_URL
      const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY
      if (!supabaseUrl || !serviceRoleKey) {
        console.error("[v0] Supabase storage credentials are not configured")
        return NextResponse.json({ success: false, error: "Armazenamento de arquivos indisponível" }, { status: 503 })
      }
      const serviceSupabase = createServiceClient(supabaseUrl, serviceRoleKey)
      const filePath = `submissions/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`
      const { error: uploadError } = await serviceSupabase.storage.from("submission-files").upload(filePath, file, { contentType: file.type || "application/octet-stream", upsert: false })
      if (uploadError) throw uploadError
      const { data: publicFile } = serviceSupabase.storage.from("submission-files").getPublicUrl(filePath)
      movementFileData = publicFile.publicUrl
      movementFileName = file.name
    }

    const supabase = await createClient()
    const isMultipart = contentType.includes("multipart/form-data")
    const readValue = (jsonKey: string, formKey: string) => isMultipart ? data.get(formKey) : data[jsonKey]
    const readArray = (jsonKey: string, formKey: string) => {
      const value = readValue(jsonKey, formKey)
      if (Array.isArray(value)) return value
      if (typeof value === "string") {
        try { return JSON.parse(value) }
        catch { return [] }
      }
      return []
    }

    const requesterName = String(readValue("name", "name") || "").trim()
    const registration = String(readValue("matricula", "matricula") || "").trim()
    const institution = String(readValue("institution", "institution") || "").trim()
    if (!requesterName || !registration || !institution) {
      return NextResponse.json({ success: false, error: "Preencha nome, matrícula e instituição." }, { status: 400 })
    }

    const submissionType = String(readValue("submissionType", "submissionType") || "uniformes")
    const targetTable = submissionType.startsWith("movimentacoes") ? "movement_submissions" : "submissions"
    const payload = {
      requester_name: requesterName,
      registration,
      institution,
      tmbp_pms_number: readValue("tmbpPmsNumber", "tmbpPmsNumber") || null,
      submission_type: submissionType,
      uniforms: readArray("uniforms", "uniforms"),
      shoes: readArray("shoes", "shoes"),
      student_kits: readArray("studentKits", "studentKits"),
      teacher_polos: readArray("teacherPolos", "teacherPolos"),
      backpacks: readArray("backpacks", "backpacks"),
      stationery_items: readArray("stationeryItems", "stationeryItems"),
      kitchen_items: readArray("kitchenItems", "kitchenItems"),
      creche_items: readArray("crecheItems", "crecheItems"),
      movement_file_name: movementFileName,
      movement_file_data: movementFileData,
    }

    // Do not request the inserted row here: public submitters may INSERT but must not SELECT all requests.
    const { error } = await supabase.from(targetTable).insert(payload)
    if (error) {
      console.error("Error inserting submission:", error)
      return NextResponse.json({ success: false, error: "Não foi possível salvar a solicitação." }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in POST:", error)
    return NextResponse.json({ success: false, error: "Failed to save submission" }, { status: 500 })
  }
}
