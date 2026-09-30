"use client"

import { useMemo, useState } from "react"
import { CheckCircle2, FileText, Search, Upload, Clock3, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { InstitutionPicker } from "@/components/institution-picker"

type Movimento = { id: string; name: string; matricula: string; institution: string; fileName: string; status: "pendente" | "aprovado" | "refazer"; feedback?: string }

export default function MovimentacoesForm() {
  const [movimentos, setMovimentos] = useState<Movimento[]>([])
  const [name, setName] = useState("")
  const [matricula, setMatricula] = useState("")
  const [institution, setInstitution] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [search, setSearch] = useState("")
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const searchSubmissions = async () => {
    if (!search.trim()) return
    const response = await fetch("/api/submissions")
    const data = await response.json()
    setMovimentos((data.submissions || []).filter((item: any) => item.submissionType === "movimentacoes" && item.institution.toLowerCase().includes(search.trim().toLowerCase())))
  }

  const filteredMovimentos = useMemo(() => movimentos.filter((item) => !search.trim() || item.institution.toLowerCase().includes(search.trim().toLowerCase())), [movimentos, search])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!name || !matricula || !institution || !file) return
    setLoading(true)
    try {
      const movementFileData = await new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = reject; reader.readAsDataURL(file) })
      const response = await fetch("/api/submissions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, matricula, institution, submissionType: "movimentacoes", movementFileName: file.name, movementFileData }) })
      if (!response.ok) throw new Error("Falha ao enviar")
      setName(""); setMatricula(""); setInstitution(""); setFile(null); setSent(true); await searchSubmissions(); window.setTimeout(() => setSent(false), 6000)
    } catch { alert("Não foi possível enviar o termo. Tente novamente.") } finally { setLoading(false) }
  }

  return <div className="flex flex-col gap-6">
    <Card><CardHeader><CardTitle className="flex items-center gap-2"><FileText className="size-5 text-primary" /> Enviar termo de movimentação</CardTitle><CardDescription>Envie o arquivo para conferência administrativa. Após confirmar, volte para consultar o resultado em até 10 minutos.</CardDescription></CardHeader><CardContent><form onSubmit={handleSubmit} className="flex flex-col gap-4"><div className="grid gap-4 md:grid-cols-2"><div className="flex flex-col gap-2"><Label htmlFor="mov-name">Nome</Label><Input id="mov-name" value={name} onChange={(e) => setName(e.target.value)} required /></div><div className="flex flex-col gap-2"><Label htmlFor="mov-matricula">Matrícula</Label><Input id="mov-matricula" value={matricula} onChange={(e) => setMatricula(e.target.value)} required /></div></div><div className="flex flex-col gap-2"><Label>Instituição</Label><InstitutionPicker value={institution} onChange={setInstitution} /></div><div className="flex flex-col gap-2"><Label htmlFor="mov-file">Termo ou arquivo</Label><label htmlFor="mov-file" className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed p-4 text-sm text-muted-foreground hover:border-primary"><Upload className="size-5 text-primary" /><span className="truncate">{file ? file.name : "Clique para anexar PDF, DOC ou imagem"}</span></label><Input id="mov-file" type="file" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" className="sr-only" onChange={(e) => setFile(e.target.files?.[0] ?? null)} required /></div><Button type="submit" disabled={!file || loading}>{loading ? "Enviando..." : "Enviar para análise"}</Button>{sent && <div className="flex items-center gap-2 rounded-lg bg-primary/10 p-3 text-sm text-primary" role="status"><CheckCircle2 className="size-4" /> Envio confirmado. Volte em até 10 minutos para verificar.</div>}</form></CardContent></Card>
    <Card><CardHeader><CardTitle>Consultar envios da instituição</CardTitle><CardDescription>Digite a instituição e clique em consultar para acompanhar a revisão.</CardDescription><div className="flex gap-2 pt-2"><div className="relative flex-1"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Nome da instituição" className="pl-9" /></div><Button type="button" variant="outline" onClick={searchSubmissions}>Consultar</Button></div></CardHeader><CardContent>{filteredMovimentos.length === 0 ? <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">Nenhum envio encontrado para esta instituição.</p> : <div className="flex flex-col gap-3">{filteredMovimentos.map((item) => <div key={item.id} className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-medium">{item.name}</p><p className="text-sm text-muted-foreground">Matrícula {item.matricula} · {item.fileName}</p>{item.status === "refazer" && <p className="mt-2 text-sm text-destructive">Reprovado — por favor refazer: {item.feedback || "Confira o arquivo enviado."}</p>}</div><Badge variant={item.status === "aprovado" ? "default" : item.status === "refazer" ? "destructive" : "secondary"}>{item.status === "pendente" && <Clock3 className="mr-1 size-3" />}{item.status === "refazer" && <AlertCircle className="mr-1 size-3" />}{item.status === "aprovado" ? "Finalizado e confirmado" : item.status === "refazer" ? "Reprovado - por favor refazer" : "Em análise"}</Badge></div>)}</div>}</CardContent></Card>
  </div>
}
