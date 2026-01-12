"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, Download, ArrowLeft } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

type Submission = {
  id: string
  timestamp: string
  name: string
  matricula: string
  institution: string
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
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [filteredSubmissions, setFilteredSubmissions] = useState<Submission[]>([])
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [institutionFilter, setInstitutionFilter] = useState<string>("all")
  const [segmentFilter, setSegmentFilter] = useState<string>("all")
  const [yearFilter, setYearFilter] = useState<string>("all")
  const [institutions, setInstitutions] = useState<string[]>([])
  const [years, setYears] = useState<string[]>([])
  const router = useRouter()

  useEffect(() => {
    const auth = sessionStorage.getItem("adminAuth")
    if (auth === "true") {
      setIsAuthenticated(true)
      fetchSubmissions()
    } else {
      router.push("/")
    }
  }, [router])

  useEffect(() => {
    const uniqueInstitutions = [...new Set(submissions.map((s) => s.institution))].sort()
    setInstitutions(uniqueInstitutions)

    const uniqueYears = [...new Set(submissions.map((s) => new Date(s.timestamp).getFullYear().toString()))].sort(
      (a, b) => Number(b) - Number(a),
    )
    setYears(uniqueYears)
  }, [submissions])

  useEffect(() => {
    let filtered = submissions

    if (institutionFilter !== "all") {
      filtered = filtered.filter((s) => s.institution === institutionFilter)
    }

    if (segmentFilter !== "all") {
      filtered = filtered.filter((s) => s.uniforms.some((u) => u.gender === segmentFilter))
    }

    if (yearFilter !== "all") {
      filtered = filtered.filter((s) => new Date(s.timestamp).getFullYear().toString() === yearFilter)
    }

    setFilteredSubmissions(filtered)
  }, [submissions, institutionFilter, segmentFilter, yearFilter])

  const fetchSubmissions = () => {
    try {
      const storedSubmissions = localStorage.getItem("uniformSubmissions")
      if (storedSubmissions) {
        const parsed = JSON.parse(storedSubmissions)
        setSubmissions(parsed)
        setFilteredSubmissions(parsed)
      } else {
        setSubmissions([])
        setFilteredSubmissions([])
      }
    } catch (error) {
      console.error("Error fetching submissions:", error)
      setSubmissions([])
      setFilteredSubmissions([])
    }
  }

  const viewDetails = (submission: Submission) => {
    setSelectedSubmission(submission)
    setShowDetailModal(true)
  }

  const exportToCSV = () => {
    if (filteredSubmissions.length === 0) return

    let csv = "Data/Hora,Nome,Matrícula,Instituição,Segmento,Tipo,Gênero,Tamanho,Quantidade\n"

    filteredSubmissions.forEach((sub) => {
      const date = new Date(sub.timestamp).toLocaleString("pt-BR")

      sub.uniforms.forEach((uniform) => {
        csv += `"${date}","${sub.name}","${sub.matricula}","${sub.institution}","${uniform.type}","Uniforme","${uniform.gender}","${uniform.size}","${uniform.quantity}"\n`
      })

      sub.shoes.forEach((shoe) => {
        csv += `"${date}","${sub.name}","${sub.matricula}","${sub.institution}","N/A","Tênis","N/A","${shoe.size}","${shoe.quantity}"\n`
      })
    })

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `solicitacoes_${Date.now()}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleLogout = () => {
    sessionStorage.removeItem("adminAuth")
    router.push("/")
  }

  const clearFilters = () => {
    setInstitutionFilter("all")
    setSegmentFilter("all")
    setYearFilter("all")
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Painel Administrativo</h1>
            <p className="text-muted-foreground">Visualize todas as solicitações de uniformes e calçados</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={exportToCSV} variant="outline" disabled={filteredSubmissions.length === 0}>
              <Download className="mr-2 h-4 w-4" />
              Exportar CSV
            </Button>
            <Button onClick={handleLogout} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle>Solicitações Recebidas ({filteredSubmissions.length})</CardTitle>
              <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                <div className="space-y-2 sm:space-y-0 sm:w-48">
                  <Label className="sm:sr-only">Instituição</Label>
                  <Select value={institutionFilter} onValueChange={setInstitutionFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas Instituições" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas Instituições</SelectItem>
                      {institutions.map((inst) => (
                        <SelectItem key={inst} value={inst}>
                          {inst}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 sm:space-y-0 sm:w-48">
                  <Label className="sm:sr-only">Gênero</Label>
                  <Select value={segmentFilter} onValueChange={setSegmentFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos os Gêneros" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os Gêneros</SelectItem>
                      <SelectItem value="Masculino">Masculino</SelectItem>
                      <SelectItem value="Feminino">Feminino</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 sm:space-y-0 sm:w-36">
                  <Label className="sm:sr-only">Ano</Label>
                  <Select value={yearFilter} onValueChange={setYearFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos os Anos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os Anos</SelectItem>
                      {years.map((year) => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={clearFilters} variant="outline" size="sm">
                  Limpar
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredSubmissions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {submissions.length === 0
                  ? "Nenhuma solicitação recebida ainda."
                  : "Nenhuma solicitação encontrada com os filtros selecionados."}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data/Hora</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Matrícula</TableHead>
                      <TableHead>Instituição</TableHead>
                      <TableHead>Uniformes</TableHead>
                      <TableHead>Calçados</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSubmissions.map((submission) => (
                      <TableRow key={submission.id}>
                        <TableCell className="whitespace-nowrap">
                          {new Date(submission.timestamp).toLocaleString("pt-BR")}
                        </TableCell>
                        <TableCell className="font-medium">{submission.name}</TableCell>
                        <TableCell>{submission.matricula}</TableCell>
                        <TableCell>{submission.institution}</TableCell>
                        <TableCell>{submission.uniforms.length}</TableCell>
                        <TableCell>{submission.shoes.length}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => viewDetails(submission)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes da Solicitação</DialogTitle>
            <DialogDescription>
              Solicitação enviada em{" "}
              {selectedSubmission && new Date(selectedSubmission.timestamp).toLocaleString("pt-BR")}
            </DialogDescription>
          </DialogHeader>
          {selectedSubmission && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3 text-lg">Dados do Solicitante</h3>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-xs text-muted-foreground mb-1">Nome</p>
                    <p className="font-medium">{selectedSubmission.name}</p>
                  </div>
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-xs text-muted-foreground mb-1">Matrícula</p>
                    <p className="font-medium">{selectedSubmission.matricula}</p>
                  </div>
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-xs text-muted-foreground mb-1">Instituição</p>
                    <p className="font-medium">{selectedSubmission.institution}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3 text-lg">Uniformes Solicitados</h3>
                <div className="space-y-2">
                  {selectedSubmission.uniforms.map((uniform, index) => (
                    <div key={index} className="rounded-lg border border-border p-4">
                      <div className="grid gap-3 sm:grid-cols-4">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Segmento</p>
                          <p className="font-medium">{uniform.type}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Gênero</p>
                          <p className="font-medium">{uniform.gender}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Tamanho</p>
                          <p className="font-medium">{uniform.size}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Quantidade</p>
                          <p className="font-medium">{uniform.quantity}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3 text-lg">Calçados Solicitados (Tênis)</h3>
                <div className="space-y-2">
                  {selectedSubmission.shoes.map((shoe, index) => (
                    <div key={index} className="rounded-lg border border-border p-4">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Tamanho</p>
                          <p className="font-medium">{shoe.size}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Quantidade</p>
                          <p className="font-medium">{shoe.quantity}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </main>
  )
}
