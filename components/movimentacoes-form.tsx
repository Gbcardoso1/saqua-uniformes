"use client"

import { useMemo, useState } from "react"
import { CheckCircle2, FileText, Search, Upload, Clock3, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { InstitutionPicker } from "@/components/institution-picker"

type Movimento = {
  name: string
  matricula: string
  institution: string
  fileName: string
  status: "pendente" | "aprovado" | "refazer"
  feedback?: string
}

const initialMovimentos: Movimento[] = []

export default function MovimentacoesForm() {
  const [movimentos, setMovimentos] = useState<Movimento[]>(initialMovimentos)
  const [name, setName] = useState("")
  const [matricula, setMatricula] = useState("")
  const [institution, setInstitution] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [search, setSearch] = useState("")
  const [sent, setSent] = useState(false)

  const filteredMovimentos = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return movimentos
    return movimentos.filter((item) => item.institution.toLowerCase().includes(term))
  }, [movimentos, search])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!name || !matricula || !institution || !file) return
    setMovimentos((current) => [{ name, matricula, institution, fileName: file.name, status: "pendente" }, ...current])
    setName("")
    setMatricula("")
    setInstitution("")
    setFile(null)
    setSent(true)
    window.setTimeout(() => setSent(false), 4500)
  }

  const statusLabel = { pendente: "Em análise", aprovado: "OK", refazer: "Refazer termo" }

  return (
    <div className="flex flex-col gap-6">
      <Card className="border-white/20 bg-background/95 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><FileText className="size-5 text-primary" /> Enviar termo de movimentação</CardTitle>
          <CardDescription>Preencha os dados da movimentação e anexe o termo para análise da agente.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-2"><Label htmlFor="mov-name">Nome</Label><Input id="mov-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome completo" required /></div>
              <div className="flex flex-col gap-2"><Label htmlFor="mov-matricula">Matrícula</Label><Input id="mov-matricula" value={matricula} onChange={(e) => setMatricula(e.target.value)} placeholder="Número da matrícula" required /></div>
            </div>
            <div className="flex flex-col gap-2"><Label>Instituição</Label><InstitutionPicker value={institution} onChange={setInstitution} /></div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="mov-file">Termo ou arquivo</Label>
              <label htmlFor="mov-file" className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed p-4 text-sm text-muted-foreground transition-colors hover:border-primary hover:bg-muted/40">
                <Upload className="size-5 text-primary" /><span className="truncate">{file ? file.name : "Clique para anexar PDF, DOC ou imagem"}</span>
              </label>
              <Input id="mov-file" type="file" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" className="sr-only" onChange={(e) => setFile(e.target.files?.[0] ?? null)} required />
            </div>
            <Button type="submit" className="w-full sm:w-fit" disabled={!file}>Enviar para análise</Button>
            {sent && <div className="flex items-center gap-2 rounded-lg bg-primary/10 p-3 text-sm text-primary" role="status"><CheckCircle2 className="size-4" /> Termo enviado. Acompanhe o status pela instituição.</div>}
          </form>
        </CardContent>
      </Card>

      <Card className="border-white/20 bg-background/95 shadow-xl">
        <CardHeader>
          <CardTitle>Consultar envios da instituição</CardTitle>
          <CardDescription>Busque pelo nome da instituição para acompanhar os termos enviados.</CardDescription>
          <div className="relative pt-2"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Digite o nome da instituição" className="pl-9" aria-label="Buscar por instituição" /></div>
        </CardHeader>
        <CardContent>
          {filteredMovimentos.length === 0 ? <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">Nenhum envio encontrado para esta instituição.</p> : <div className="flex flex-col gap-3">{filteredMovimentos.map((item, index) => <div key={`${item.fileName}-${index}`} className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-medium">{item.name}</p><p className="text-sm text-muted-foreground">Matrícula {item.matricula} · {item.fileName}</p>{item.feedback && <p className="mt-2 text-sm text-destructive">{item.feedback}</p>}</div><Badge variant={item.status === "aprovado" ? "default" : item.status === "refazer" ? "destructive" : "secondary"}>{item.status === "pendente" && <Clock3 className="mr-1 size-3" />}{item.status === "refazer" && <AlertCircle className="mr-1 size-3" />}{statusLabel[item.status]}</Badge></div>)}</div>}
        </CardContent>
      </Card>
    </div>
  )
}
