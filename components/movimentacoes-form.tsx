"use client"

import { useState } from "react"
import { AlertCircle, CheckCircle2, Clock3, Download, FileText, Search, Upload } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { InstitutionPicker } from "@/components/institution-picker"

type Movimento = {
  id: string
  name: string
  matricula: string
  institution: string
  fileName: string
  status: "pendente" | "aprovado" | "refazer"
  feedback?: string
  movementFileData?: string
}

export default function MovimentacoesForm() {
  const [movimentos, setMovimentos] = useState<Movimento[]>([])
  const [name, setName] = useState("")
  const [matricula, setMatricula] = useState("")
  const [institution, setInstitution] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [queryName, setQueryName] = useState("")
  const [queryMatricula, setQueryMatricula] = useState("")
  const [queryInstitution, setQueryInstitution] = useState("")
  const [sentReceipt, setSentReceipt] = useState<{ id: string; date: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [searching, setSearching] = useState(false)

  const searchSubmissions = async () => {
    if (!queryName.trim() || !queryMatricula.trim() || !queryInstitution) return
    setSearching(true)
    try {
      const response = await fetch("/api/submissions")
      const data = await response.json()
      setMovimentos((data.submissions || []).filter((item: Movimento & { submissionType?: string }) =>
        item.submissionType === "movimentacoes" &&
        item.name.trim().toLowerCase() === queryName.trim().toLowerCase() &&
        item.matricula.trim().toLowerCase() === queryMatricula.trim().toLowerCase() &&
        item.institution === queryInstitution,
      ))
    } finally {
      setSearching(false)
    }
  }

  const downloadReceipt = async () => {
    if (!sentReceipt) return
    const { jsPDF } = await import("jspdf")
    const doc = new jsPDF()
    doc.setFontSize(18)
    doc.setFont("helvetica", "bold")
    doc.text("COMPROVANTE DE ENVIO", 105, 25, { align: "center" })
    doc.line(20, 32, 190, 32)
    doc.setFontSize(11)
    doc.setFont("helvetica", "normal")
    doc.text(`Protocolo: ${sentReceipt.id}`, 20, 48)
    doc.text(`Nome: ${name || queryName}`, 20, 58)
    doc.text(`Matrícula: ${matricula || queryMatricula}`, 20, 68)
    doc.text(`Instituição: ${institution || queryInstitution}`, 20, 78)
    doc.text(`Arquivo: ${file?.name || "Termo de movimentação"}`, 20, 88)
    doc.text(`Enviado em: ${new Date(sentReceipt.date).toLocaleString("pt-BR")}`, 20, 98)
    doc.setFont("helvetica", "bold")
    doc.text("Status: Enviado para análise administrativa", 20, 115)
    doc.setFont("helvetica", "normal")
    doc.text("Consulte novamente em até 10 minutos para verificar o resultado.", 20, 130)
    doc.save(`comprovante-movimentacao-${sentReceipt.id}.pdf`)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!name || !matricula || !institution || !file) return
    setLoading(true)
    try {
      const movementFileData = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(String(reader.result))
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, matricula, institution, submissionType: "movimentacoes", movementFileName: file.name, movementFileData }),
      })
      const result = await response.json()
      if (!response.ok || !result.success) throw new Error("Falha ao enviar")
      setSentReceipt({ id: result.submission.id, date: new Date().toISOString() })
      setQueryName(name)
      setQueryMatricula(matricula)
      setQueryInstitution(institution)
      setName("")
      setMatricula("")
      setInstitution("")
      setFile(null)
    } catch {
      alert("Não foi possível enviar o termo. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><FileText className="size-5 text-primary" /> Enviar termo de movimentação</CardTitle>
          <CardDescription>Envie o arquivo para conferência administrativa. Guarde o comprovante e volte em até 10 minutos para consultar.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-2"><Label htmlFor="mov-name">Nome</Label><Input id="mov-name" value={name} onChange={(e) => setName(e.target.value)} required /></div>
              <div className="flex flex-col gap-2"><Label htmlFor="mov-matricula">Matrícula</Label><Input id="mov-matricula" value={matricula} onChange={(e) => setMatricula(e.target.value)} required /></div>
            </div>
            <div className="flex flex-col gap-2"><Label>Instituição</Label><InstitutionPicker value={institution} onChange={setInstitution} required /></div>
            <div className="flex flex-col gap-2"><Label htmlFor="mov-file">Termo ou arquivo</Label><label htmlFor="mov-file" className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed p-4 text-sm text-muted-foreground hover:border-primary"><Upload className="size-5 text-primary" /><span className="truncate">{file ? file.name : "Clique para anexar PDF, DOC ou imagem"}</span></label><Input id="mov-file" type="file" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" className="sr-only" onChange={(e) => setFile(e.target.files?.[0] ?? null)} required /></div>
            <Button type="submit" disabled={!file || loading}>{loading ? "Enviando..." : "Enviar para análise"}</Button>
          </form>
          {sentReceipt && <div className="mt-4 flex flex-col gap-3 rounded-lg border border-primary/30 bg-primary/10 p-4" role="status"><div className="flex items-start gap-3"><CheckCircle2 className="mt-0.5 size-5 text-primary" /><div><p className="font-medium text-primary">Envio confirmado</p><p className="text-sm text-muted-foreground">Protocolo: {sentReceipt.id}. Volte em até 10 minutos para verificar se foi aprovado ou se precisa refazer.</p></div></div><Button type="button" variant="outline" onClick={downloadReceipt} className="w-fit"><Download data-icon="inline-start" /> Baixar comprovante</Button></div>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Consultar envio</CardTitle><CardDescription>Informe nome e matrícula; depois selecione a instituição na lista para consultar a situação.</CardDescription></CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex flex-col gap-2"><Label htmlFor="query-name">Nome</Label><Input id="query-name" value={queryName} onChange={(e) => setQueryName(e.target.value)} /></div>
            <div className="flex flex-col gap-2"><Label htmlFor="query-matricula">Matrícula</Label><Input id="query-matricula" value={queryMatricula} onChange={(e) => setQueryMatricula(e.target.value)} /></div>
            <div className="flex flex-col gap-2"><Label>Instituição</Label><InstitutionPicker value={queryInstitution} onChange={setQueryInstitution} /></div>
          </div>
          <Button type="button" variant="outline" onClick={searchSubmissions} disabled={searching || !queryName || !queryMatricula || !queryInstitution}><Search data-icon="inline-start" /> {searching ? "Consultando..." : "Consultar situação"}</Button>
          {movimentos.length === 0 ? <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">Informe nome, matrícula e instituição para consultar.</p> : <div className="flex flex-col gap-3">{movimentos.map((item) => <div key={item.id} className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-medium">{item.fileName}</p>{item.status === "refazer" && <div className="mt-2 flex flex-col items-start gap-1"><p className="text-sm text-destructive">Reprovado - por favor refazer: {item.feedback || "Confira o arquivo enviado."}</p>{item.movementFileData && <a href={item.movementFileData} download={item.fileName || "arquivo-movimentacao"} className="text-sm font-medium text-primary underline underline-offset-4">Baixar arquivo enviado para conferir</a>}</div>}</div><Badge variant={item.status === "aprovado" ? "default" : item.status === "refazer" ? "destructive" : "secondary"}>{item.status === "pendente" && <Clock3 className="mr-1 size-3" />}{item.status === "refazer" && <AlertCircle className="mr-1 size-3" />}{item.status === "aprovado" ? "Finalizado e confirmado" : item.status === "refazer" ? "Reprovado - por favor refazer" : "Em análise"}</Badge></div>)}</div>}
        </CardContent>
      </Card>
    </div>
  )
}
