"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, Download, ArrowLeft, Trash2, CheckCircle2, Loader2, Clock, FileDown, Package, Shirt, MessageSquare, LayoutDashboard } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

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
    kit?: string
    kitQuantity?: string
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

type Feedback = {
  id: string
  institution: string
  message: string
  category: string
  status: string
  created_at: string
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [filteredSubmissions, setFilteredSubmissions] = useState<Submission[]>([])
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [submissionToDelete, setSubmissionToDelete] = useState<Submission | null>(null)
  const [institutionFilter, setInstitutionFilter] = useState<string>("all")
  const [segmentFilter, setSegmentFilter] = useState<string>("all")
  const [monthFilter, setMonthFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [nameFilter, setNameFilter] = useState<string>("all")
  const [activeTab, setActiveTab] = useState<"almoxarifado" | "uniformes" | "feedbacks">("almoxarifado")
  const [institutions, setInstitutions] = useState<string[]>([])
  const [names, setNames] = useState<string[]>([])
  const [months, setMonths] = useState<{ value: string; label: string }[]>([])
  const [isDeleting, setIsDeleting] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [filteredFeedbacks, setFilteredFeedbacks] = useState<Feedback[]>([])
  const [feedbackInstitutionFilter, setFeedbackInstitutionFilter] = useState<string>("all")
  const [feedbackCategoryFilter, setFeedbackCategoryFilter] = useState<string>("all")
  const [feedbackStatusFilter, setFeedbackStatusFilter] = useState<string>("all")
  const [feedbackInstitutions, setFeedbackInstitutions] = useState<string[]>([])
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null)
  const [showFeedbackDetailModal, setShowFeedbackDetailModal] = useState(false)
  const [showDeleteFeedbackModal, setShowDeleteFeedbackModal] = useState(false)
  const [feedbackToDelete, setFeedbackToDelete] = useState<Feedback | null>(null)
  const [isDeletingFeedback, setIsDeletingFeedback] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const auth = sessionStorage.getItem("adminAuth")
    if (auth === "true") {
      setIsAuthenticated(true)
      fetchSubmissions()
      fetchFeedbacks()
    } else {
      router.push("/")
    }
  }, [router])

  useEffect(() => {
    const uniqueInstitutions = [...new Set(submissions.map((s) => s.institution))].sort()
    setInstitutions(uniqueInstitutions)

    const uniqueNames = [...new Set(submissions.map((s) => s.name).filter(Boolean))].sort()
    setNames(uniqueNames)

    const monthNames = ["Janeiro", "Fevereiro", "Marco", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]
    const uniqueMonths = [...new Set(submissions.map((s) => {
      const d = new Date(s.timestamp)
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    }))].sort((a, b) => b.localeCompare(a))
    setMonths(uniqueMonths.map((m) => {
      const [year, month] = m.split("-")
      return { value: m, label: `${monthNames[Number(month) - 1]} ${year}` }
    }))
  }, [submissions])

  useEffect(() => {
    const uniqueFeedbackInstitutions = [...new Set(feedbacks.map((f) => f.institution))].sort()
    setFeedbackInstitutions(uniqueFeedbackInstitutions)
  }, [feedbacks])

  useEffect(() => {
    let filtered = feedbacks

    if (feedbackInstitutionFilter !== "all") {
      filtered = filtered.filter((f) => f.institution === feedbackInstitutionFilter)
    }

    if (feedbackCategoryFilter !== "all") {
      filtered = filtered.filter((f) => f.category === feedbackCategoryFilter)
    }

    if (feedbackStatusFilter !== "all") {
      filtered = filtered.filter((f) => (f.status || "pendente") === feedbackStatusFilter)
    }

    setFilteredFeedbacks(filtered)
  }, [feedbacks, feedbackInstitutionFilter, feedbackCategoryFilter, feedbackStatusFilter])

  useEffect(() => {
    let filtered = submissions

    // Filter by active tab
    filtered = filtered.filter((s) => (s.submissionType || "uniformes") === activeTab)

    if (typeFilter !== "all") {
      filtered = filtered.filter((s) => (s.submissionType || "uniformes") === typeFilter)
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((s) => (s.status || "pendente") === statusFilter)
    }

    if (institutionFilter !== "all") {
      filtered = filtered.filter((s) => s.institution === institutionFilter)
    }

    if (nameFilter !== "all") {
      filtered = filtered.filter((s) => s.name === nameFilter)
    }

    if (segmentFilter !== "all") {
      filtered = filtered.filter((s) => s.uniforms.some((u) => u.gender === segmentFilter))
    }

    if (monthFilter !== "all") {
      filtered = filtered.filter((s) => {
        const d = new Date(s.timestamp)
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}` === monthFilter
      })
    }

    setFilteredSubmissions(filtered)
  }, [submissions, institutionFilter, nameFilter, segmentFilter, monthFilter, typeFilter, statusFilter, activeTab])

  const fetchSubmissions = async () => {
    try {
      const response = await fetch("/api/submissions")
      const data = await response.json()

      if (data.submissions) {
        setSubmissions(data.submissions)
        setFilteredSubmissions(data.submissions)
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

  const fetchFeedbacks = async () => {
    try {
      const response = await fetch("/api/feedbacks")
      const data = await response.json()
      if (Array.isArray(data)) {
        setFeedbacks(data)
      }
    } catch (error) {
      console.error("Error fetching feedbacks:", error)
    }
  }

  const viewDetails = (submission: Submission) => {
    setSelectedSubmission(submission)
    setShowDetailModal(true)
  }

  const confirmDelete = (submission: Submission) => {
    setSubmissionToDelete(submission)
    setShowDeleteModal(true)
  }

  const deleteSubmission = async () => {
    if (!submissionToDelete) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/submissions/${submissionToDelete.id}`, {
        method: "DELETE",
      })

      const result = await response.json()

      if (result.success) {
        setSubmissions(submissions.filter((s) => s.id !== submissionToDelete.id))
        setShowDeleteModal(false)
        setSubmissionToDelete(null)
      } else {
        alert("Erro ao excluir solicitação. Tente novamente.")
      }
    } catch (error) {
      console.error("Error deleting submission:", error)
      alert("Erro ao excluir solicitação. Tente novamente.")
    } finally {
      setIsDeleting(false)
    }
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

      sub.studentKits?.forEach((kit) => {
        csv += `"${date}","${sub.name}","${sub.matricula}","${sub.institution}","N/A","Kit Aluno","N/A","${kit.size}","${kit.quantity}"\n`
      })

      sub.teacherPolos?.forEach((polo) => {
        csv += `"${date}","${sub.name}","${sub.matricula}","${sub.institution}","N/A","Polo Professor","N/A","${polo.size}","${polo.quantity}"\n`
      })

      sub.backpacks?.forEach((backpack) => {
        csv += `"${date}","${sub.name}","${sub.matricula}","${sub.institution}","N/A","Mochila","N/A","${backpack.size}","${backpack.quantity}"\n`
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

  const almoxarifadoCount = submissions.filter((s) => s.submissionType === "almoxarifado").length
  const uniformesCount = submissions.filter((s) => (s.submissionType || "uniformes") === "uniformes").length
  const pendingFeedbacksCount = feedbacks.filter((f) => (f.status || "pendente") === "pendente").length

  const handleTabChange = (tab: "almoxarifado" | "uniformes" | "feedbacks") => {
    setActiveTab(tab)
    setInstitutionFilter("all")
    setNameFilter("all")
    setSegmentFilter("all")
    setMonthFilter("all")
    setTypeFilter("all")
    setStatusFilter("all")
  }

  const clearFilters = () => {
    setInstitutionFilter("all")
    setNameFilter("all")
    setSegmentFilter("all")
    setMonthFilter("all")
    setTypeFilter("all")
    setStatusFilter("all")
  }

  const clearFeedbackFilters = () => {
    setFeedbackInstitutionFilter("all")
    setFeedbackCategoryFilter("all")
    setFeedbackStatusFilter("all")
  }

  const viewFeedbackDetails = (feedback: Feedback) => {
    setSelectedFeedback(feedback)
    setShowFeedbackDetailModal(true)
  }

  const confirmDeleteFeedback = (feedback: Feedback) => {
    setFeedbackToDelete(feedback)
    setShowDeleteFeedbackModal(true)
  }

  const deleteFeedback = async () => {
    if (!feedbackToDelete) return

    setIsDeletingFeedback(true)
    try {
      const response = await fetch(`/api/feedbacks/${feedbackToDelete.id}`, {
        method: "DELETE",
      })

      const result = await response.json()

      if (result.success) {
        setFeedbacks(feedbacks.filter((f) => f.id !== feedbackToDelete.id))
        setShowDeleteFeedbackModal(false)
        setFeedbackToDelete(null)
      } else {
        alert("Erro ao excluir feedback. Tente novamente.")
      }
    } catch (error) {
      console.error("Error deleting feedback:", error)
      alert("Erro ao excluir feedback. Tente novamente.")
    } finally {
      setIsDeletingFeedback(false)
    }
  }

  const exportFeedbacksToCSV = () => {
    if (filteredFeedbacks.length === 0) return

    let csv = "Data/Hora,Instituicao,Categoria,Status,Mensagem\n"

    filteredFeedbacks.forEach((feedback) => {
      const date = new Date(feedback.created_at).toLocaleString("pt-BR")
      const message = feedback.message.replace(/"/g, '""').replace(/\n/g, ' ')
      csv += `"${date}","${feedback.institution}","${getCategoryLabel(feedback.category)}","${feedback.status || 'pendente'}","${message}"\n`
    })

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `feedbacks_${Date.now()}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const updateFeedbackStatus = async (feedbackId: string, newStatus: string) => {
    try {
      const response = await fetch("/api/feedbacks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: feedbackId, status: newStatus }),
      })
      if (response.ok) {
        setFeedbacks((prev) =>
          prev.map((f) => (f.id === feedbackId ? { ...f, status: newStatus } : f))
        )
      }
    } catch (error) {
      console.error("Error updating feedback:", error)
    }
  }

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      sugestao: "Sugestao",
      problema: "Problema",
      elogio: "Elogio",
      duvida: "Duvida",
    }
    return labels[category] || category
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      sugestao: "bg-blue-100 text-blue-800",
      problema: "bg-red-100 text-red-800",
      elogio: "bg-green-100 text-green-800",
      duvida: "bg-yellow-100 text-yellow-800",
    }
    return colors[category] || "bg-gray-100 text-gray-800"
  }

  const updateStatus = async (submission: Submission, newStatus: string) => {
    setIsUpdating(true)
    try {
      const response = await fetch(`/api/submissions/${submission.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        setSubmissions((prev) =>
          prev.map((s) =>
            s.id === submission.id ? { ...s, status: newStatus } : s
          )
        )
        if (selectedSubmission?.id === submission.id) {
          setSelectedSubmission((prev) =>
            prev ? { ...prev, status: newStatus } : null
          )
        }
      }
    } catch (error) {
      console.error("Error updating submission:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  const downloadSubmissionPDF = async (submission: Submission) => {
    const { jsPDF } = await import("jspdf")
    const doc = new jsPDF()
    const isAlmoxarifado = submission.submissionType === "almoxarifado"
    const date = new Date(submission.timestamp).toLocaleString("pt-BR")

    // Header
    doc.setFontSize(18)
    doc.setFont("helvetica", "bold")
    doc.text(isAlmoxarifado ? "SOLICITACAO DE ALMOXARIFADO" : "SOLICITACAO DE UNIFORMES E CALCADOS", 105, 20, { align: "center" })

    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    doc.text(`Data: ${date}`, 105, 28, { align: "center" })

    // Horizontal line
    doc.setLineWidth(0.5)
    doc.line(20, 32, 190, 32)

    // Dados do Solicitante
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("DADOS DO SOLICITANTE", 20, 40)

    doc.setFontSize(11)
    doc.setFont("helvetica", "normal")
    let yPos = 48
    doc.text(`Nome: ${submission.name}`, 20, yPos)
    yPos += 7
    doc.text(`Matricula: ${submission.matricula}`, 20, yPos)
    yPos += 7
    doc.text(`Instituicao: ${submission.institution}`, 20, yPos)
    yPos += 7
    const statusLabel = (submission.status || "pendente") === "pendente" ? "Pendente" : submission.status === "processando" ? "Processando" : "Finalizado"
    doc.text(`Status: ${statusLabel}`, 20, yPos)
    yPos += 12

    if (isAlmoxarifado) {
      // Stationery Items
      if (submission.stationeryItems && submission.stationeryItems.length > 0) {
        doc.setFontSize(14)
        doc.setFont("helvetica", "bold")
        doc.text("ITENS DE PAPELARIA", 20, yPos)
        yPos += 8
        doc.setFont("helvetica", "normal")
        doc.setFontSize(10)
        submission.stationeryItems.forEach((s, i) => {
          if (yPos > 270) { doc.addPage(); yPos = 20 }
          doc.text(`${i + 1}. ${s.item} | Qtd: ${s.quantity}`, 20, yPos)
          yPos += 6
        })
        yPos += 5
      }

      // Creche Items
      if (submission.crecheItems && submission.crecheItems.length > 0) {
        if (yPos > 250) { doc.addPage(); yPos = 20 }
        doc.setFontSize(14)
        doc.setFont("helvetica", "bold")
        doc.text("ITENS DE CRECHE", 20, yPos)
        yPos += 8
        doc.setFont("helvetica", "normal")
        doc.setFontSize(10)
        submission.crecheItems.forEach((c, i) => {
          if (yPos > 270) { doc.addPage(); yPos = 20 }
          doc.text(`${i + 1}. ${c.item} | Qtd: ${c.quantity}`, 20, yPos)
          yPos += 6
        })
        yPos += 5
      }
    } else {
      // Uniformes
      if (submission.uniforms.length > 0) {
        doc.setFontSize(14)
        doc.setFont("helvetica", "bold")
        doc.text("UNIFORMES", 20, yPos)
        yPos += 7
        doc.setFontSize(10)
        doc.setFont("helvetica", "normal")
        submission.uniforms.forEach((u, i) => {
          if (yPos > 270) { doc.addPage(); yPos = 20 }
          doc.text(`${i + 1}. Tipo: ${u.type} | Genero: ${u.gender} | Tamanho: ${u.size} | Qtd: ${u.quantity}`, 20, yPos)
          yPos += 6
        })
        yPos += 6
      }

      // Calcados
      if (submission.shoes.length > 0) {
        if (yPos > 250) { doc.addPage(); yPos = 20 }
        doc.setFontSize(14)
        doc.setFont("helvetica", "bold")
        doc.text("CALCADOS (TENIS)", 20, yPos)
        yPos += 7
        doc.setFontSize(10)
        doc.setFont("helvetica", "normal")
        submission.shoes.forEach((s, i) => {
          if (yPos > 270) { doc.addPage(); yPos = 20 }
          doc.text(`${i + 1}. Tamanho: ${s.size} | Quantidade: ${s.quantity}`, 20, yPos)
          yPos += 6
        })
        yPos += 6
      }

      // Kits de Aluno
      if (submission.studentKits && submission.studentKits.length > 0) {
        if (yPos > 250) { doc.addPage(); yPos = 20 }
        doc.setFontSize(14)
        doc.setFont("helvetica", "bold")
        doc.text("KITS DE ALUNO", 20, yPos)
        yPos += 7
        doc.setFontSize(10)
        doc.setFont("helvetica", "normal")
        submission.studentKits.forEach((k, i) => {
          if (yPos > 270) { doc.addPage(); yPos = 20 }
          doc.text(`${i + 1}. Tipo: ${k.size} | Quantidade: ${k.quantity}`, 20, yPos)
          yPos += 6
        })
        yPos += 6
      }

      // Kit de Professor
      if (submission.teacherPolos && submission.teacherPolos.some((p) => p.kit && p.kitQuantity)) {
        if (yPos > 250) { doc.addPage(); yPos = 20 }
        doc.setFontSize(14)
        doc.setFont("helvetica", "bold")
        doc.text("KIT DE PROFESSOR", 20, yPos)
        yPos += 7
        doc.setFontSize(10)
        doc.setFont("helvetica", "normal")
        submission.teacherPolos.filter((p) => p.kit && p.kitQuantity).forEach((p, i) => {
          if (yPos > 270) { doc.addPage(); yPos = 20 }
          doc.text(`${i + 1}. Kit: ${p.kit} | Qtd: ${p.kitQuantity}`, 20, yPos)
          yPos += 6
        })
        yPos += 6
      }

      // Polo de Professor
      if (submission.teacherPolos && submission.teacherPolos.some((p) => p.size && p.quantity)) {
        if (yPos > 250) { doc.addPage(); yPos = 20 }
        doc.setFontSize(14)
        doc.setFont("helvetica", "bold")
        doc.text("POLO DE PROFESSOR", 20, yPos)
        yPos += 7
        doc.setFontSize(10)
        doc.setFont("helvetica", "normal")
        submission.teacherPolos.filter((p) => p.size && p.quantity).forEach((p, i) => {
          if (yPos > 270) { doc.addPage(); yPos = 20 }
          doc.text(`${i + 1}. Tamanho: ${p.size} | Qtd: ${p.quantity}`, 20, yPos)
          yPos += 6
        })
        yPos += 6
      }

      // Mochilas
      if (submission.backpacks && submission.backpacks.length > 0) {
        if (yPos > 250) { doc.addPage(); yPos = 20 }
        doc.setFontSize(14)
        doc.setFont("helvetica", "bold")
        doc.text("MOCHILA", 20, yPos)
        yPos += 7
        doc.setFontSize(10)
        doc.setFont("helvetica", "normal")
        submission.backpacks.forEach((b, i) => {
          if (yPos > 270) { doc.addPage(); yPos = 20 }
          doc.text(`${i + 1}. Tamanho: ${b.size} | Quantidade: ${b.quantity}`, 20, yPos)
          yPos += 6
        })
      }
    }

    const type = isAlmoxarifado ? "almoxarifado" : "uniformes"
    doc.save(`solicitacao-${type}-${submission.name.replace(/\s+/g, "-")}.pdf`)
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <main className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between md:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <LayoutDashboard className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold leading-tight text-foreground md:text-2xl">Painel Administrativo</h1>
              <p className="text-sm text-muted-foreground">Gerencie todas as solicitações recebidas</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={exportToCSV} variant="outline" size="sm" disabled={filteredSubmissions.length === 0}>
              <Download className="mr-2 h-4 w-4" />
              Exportar CSV
            </Button>
            <Button onClick={handleLogout} variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-8 md:py-8">
        {/* Resumo */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <button
            type="button"
            onClick={() => handleTabChange("almoxarifado")}
            className={`flex items-center gap-4 rounded-xl border bg-card p-4 text-left transition-all hover:shadow-md ${
              activeTab === "almoxarifado" ? "border-primary ring-1 ring-primary/30" : "border-border"
            }`}
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Package className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <p className="text-2xl font-bold leading-none text-foreground">{almoxarifadoCount}</p>
              <p className="mt-1 truncate text-sm text-muted-foreground">Almoxarifado</p>
            </div>
          </button>
          <button
            type="button"
            onClick={() => handleTabChange("uniformes")}
            className={`flex items-center gap-4 rounded-xl border bg-card p-4 text-left transition-all hover:shadow-md ${
              activeTab === "uniformes" ? "border-primary ring-1 ring-primary/30" : "border-border"
            }`}
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Shirt className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <p className="text-2xl font-bold leading-none text-foreground">{uniformesCount}</p>
              <p className="mt-1 truncate text-sm text-muted-foreground">Uniformes e Kits</p>
            </div>
          </button>
          <button
            type="button"
            onClick={() => handleTabChange("feedbacks")}
            className={`flex items-center gap-4 rounded-xl border bg-card p-4 text-left transition-all hover:shadow-md ${
              activeTab === "feedbacks" ? "border-primary ring-1 ring-primary/30" : "border-border"
            }`}
          >
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <MessageSquare className="h-6 w-6" />
              {pendingFeedbacksCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground">
                  {pendingFeedbacksCount}
                </span>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-2xl font-bold leading-none text-foreground">{feedbacks.length}</p>
              <p className="mt-1 truncate text-sm text-muted-foreground">Feedbacks</p>
            </div>
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex flex-wrap gap-2 rounded-xl border border-border bg-card p-1.5">
          <button
            type="button"
            onClick={() => handleTabChange("almoxarifado")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors sm:flex-none ${
              activeTab === "almoxarifado"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Package className="h-4 w-4" />
            <span>Almoxarifado</span>
          </button>
          <button
            type="button"
            onClick={() => handleTabChange("uniformes")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors sm:flex-none ${
              activeTab === "uniformes"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Shirt className="h-4 w-4" />
            <span>Uniformes e Kits</span>
          </button>
          <button
            type="button"
            onClick={() => handleTabChange("feedbacks")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors sm:flex-none ${
              activeTab === "feedbacks"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <MessageSquare className="h-4 w-4" />
            <span>Feedbacks</span>
            {pendingFeedbacksCount > 0 && (
              <span className={`ml-0.5 inline-flex items-center justify-center rounded-full px-1.5 py-0.5 text-xs font-semibold ${
                activeTab === "feedbacks"
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "bg-destructive text-destructive-foreground"
              }`}>
                {pendingFeedbacksCount}
              </span>
            )}
          </button>
        </div>

        {activeTab === "feedbacks" ? (
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <CardTitle>Feedbacks e Sugestoes ({filteredFeedbacks.length})</CardTitle>
                <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                  <div className="space-y-2 sm:space-y-0 sm:w-44">
                    <Label className="sm:sr-only">Instituicao</Label>
                    <Select value={feedbackInstitutionFilter} onValueChange={setFeedbackInstitutionFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todas Instituicoes" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas Instituicoes</SelectItem>
                        {feedbackInstitutions.map((inst) => (
                          <SelectItem key={inst} value={inst}>
                            {inst}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 sm:space-y-0 sm:w-36">
                    <Label className="sm:sr-only">Categoria</Label>
                    <Select value={feedbackCategoryFilter} onValueChange={setFeedbackCategoryFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todas Categorias" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas Categorias</SelectItem>
                        <SelectItem value="sugestao">Sugestao</SelectItem>
                        <SelectItem value="problema">Problema</SelectItem>
                        <SelectItem value="elogio">Elogio</SelectItem>
                        <SelectItem value="duvida">Duvida</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 sm:space-y-0 sm:w-32">
                    <Label className="sm:sr-only">Status</Label>
                    <Select value={feedbackStatusFilter} onValueChange={setFeedbackStatusFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todos Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos Status</SelectItem>
                        <SelectItem value="pendente">Pendente</SelectItem>
                        <SelectItem value="lido">Lido</SelectItem>
                        <SelectItem value="resolvido">Resolvido</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={clearFeedbackFilters} variant="outline" size="sm">
                    Limpar
                  </Button>
                  <Button onClick={exportFeedbacksToCSV} variant="outline" size="sm" disabled={filteredFeedbacks.length === 0}>
                    <Download className="mr-2 h-4 w-4" />
                    CSV
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredFeedbacks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {feedbacks.length === 0
                    ? "Nenhum feedback recebido ainda."
                    : "Nenhum feedback encontrado com os filtros selecionados."}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data/Hora</TableHead>
                        <TableHead>Categoria</TableHead>
                        <TableHead>Instituicao</TableHead>
                        <TableHead>Mensagem</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Acoes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredFeedbacks.map((feedback) => (
                        <TableRow key={feedback.id}>
                          <TableCell className="whitespace-nowrap">
                            {new Date(feedback.created_at).toLocaleString("pt-BR")}
                          </TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(feedback.category)}`}>
                              {getCategoryLabel(feedback.category)}
                            </span>
                          </TableCell>
                          <TableCell className="font-medium">{feedback.institution}</TableCell>
                          <TableCell className="max-w-xs">
                            <p className="truncate text-sm text-muted-foreground">{feedback.message}</p>
                          </TableCell>
                          <TableCell>
                            {(() => {
                              const status = feedback.status || "pendente"
                              const config = {
                                pendente: { bg: "bg-yellow-100 text-yellow-800", icon: <Clock className="h-3 w-3" />, label: "Pendente" },
                                lido: { bg: "bg-blue-100 text-blue-800", icon: <Eye className="h-3 w-3" />, label: "Lido" },
                                resolvido: { bg: "bg-green-100 text-green-800", icon: <CheckCircle2 className="h-3 w-3" />, label: "Resolvido" },
                              }[status] || { bg: "bg-yellow-100 text-yellow-800", icon: <Clock className="h-3 w-3" />, label: "Pendente" }
                              return (
                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg}`}>
                                  {config.icon}
                                  {config.label}
                                </span>
                              )
                            })()}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Select
                                value={feedback.status || "pendente"}
                                onValueChange={(value) => updateFeedbackStatus(feedback.id, value)}
                              >
                                <SelectTrigger className="h-8 w-[110px] text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pendente">Pendente</SelectItem>
                                  <SelectItem value="lido">Lido</SelectItem>
                                  <SelectItem value="resolvido">Resolvido</SelectItem>
                                </SelectContent>
                              </Select>
                              <Button variant="ghost" size="sm" onClick={() => viewFeedbackDetails(feedback)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => confirmDeleteFeedback(feedback)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
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
                  <Label className="sm:sr-only">Solicitante</Label>
                  <Select value={nameFilter} onValueChange={setNameFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos os Solicitantes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os Solicitantes</SelectItem>
                      {names.map((n) => (
                        <SelectItem key={n} value={n}>
                          {n}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {activeTab === "uniformes" && (
                  <div className="space-y-2 sm:space-y-0 sm:w-48">
                    <Label className="sm:sr-only">Genero</Label>
                    <Select value={segmentFilter} onValueChange={setSegmentFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todos os Generos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos os Generos</SelectItem>
                        <SelectItem value="Masculino">Masculino</SelectItem>
                        <SelectItem value="Feminino">Feminino</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div className="space-y-2 sm:space-y-0 sm:w-44">
                  <Label className="sm:sr-only">Mes</Label>
                  <Select value={monthFilter} onValueChange={setMonthFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos os Meses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os Meses</SelectItem>
                      {months.map((month) => (
                        <SelectItem key={month.value} value={month.value}>
                          {month.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 sm:space-y-0 sm:w-36">
                  <Label className="sm:sr-only">Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos os Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os Status</SelectItem>
                      <SelectItem value="pendente">Pendente</SelectItem>
                      <SelectItem value="processando">Processando</SelectItem>
                      <SelectItem value="finalizado">Finalizado</SelectItem>
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
                      <TableHead>Status</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Matrícula</TableHead>
                      <TableHead>Instituição</TableHead>
                      <TableHead>Itens</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSubmissions.map((submission) => {
                      const isAlmoxarifado = submission.submissionType === "almoxarifado"
                      const itemCount = isAlmoxarifado
                        ? (submission.stationeryItems?.length || 0) + (submission.kitchenItems?.length || 0) + (submission.crecheItems?.length || 0)
                        : submission.uniforms.length + submission.shoes.length + (submission.studentKits?.length || 0) + (submission.teacherPolos?.length || 0) + (submission.backpacks?.length || 0)
                      
                      return (
                        <TableRow key={submission.id}>
                          <TableCell className="whitespace-nowrap">
                            {new Date(submission.timestamp).toLocaleString("pt-BR")}
                          </TableCell>
                          <TableCell>
                            {(() => {
                              const status = submission.status || "pendente"
                              const config = {
                                pendente: { bg: "bg-yellow-100 text-yellow-800", icon: <Clock className="h-3 w-3" />, label: "Pendente" },
                                processando: { bg: "bg-blue-100 text-blue-800", icon: <Loader2 className="h-3 w-3" />, label: "Processando" },
                                finalizado: { bg: "bg-green-100 text-green-800", icon: <CheckCircle2 className="h-3 w-3" />, label: "Finalizado" },
                              }[status] || { bg: "bg-yellow-100 text-yellow-800", icon: <Clock className="h-3 w-3" />, label: "Pendente" }
                              return (
                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg}`}>
                                  {config.icon}
                                  {config.label}
                                </span>
                              )
                            })()}
                          </TableCell>
                          <TableCell className="font-medium">{submission.name}</TableCell>
                          <TableCell>{submission.matricula}</TableCell>
                          <TableCell>{submission.institution}</TableCell>
                          <TableCell>{itemCount} itens</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Select
                                value={submission.status || "pendente"}
                                onValueChange={(value) => updateStatus(submission, value)}
                                disabled={isUpdating}
                              >
                                <SelectTrigger className="h-8 w-[130px] text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pendente">Pendente</SelectItem>
                                  <SelectItem value="processando">Processando</SelectItem>
                                  <SelectItem value="finalizado">Finalizado</SelectItem>
                                </SelectContent>
                              </Select>
                              <Button variant="ghost" size="sm" onClick={() => downloadSubmissionPDF(submission)} title="Baixar PDF">
                                <FileDown className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => viewDetails(submission)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => confirmDelete(submission)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
        )}
      </div>

      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle>Detalhes da Solicitação</DialogTitle>
                <DialogDescription>
                  Solicitação enviada em{" "}
                  {selectedSubmission && new Date(selectedSubmission.timestamp).toLocaleString("pt-BR")}
                </DialogDescription>
              </div>
              {selectedSubmission && (
                <div className="flex gap-2">
                  <Select
                    value={selectedSubmission.status || "pendente"}
                    onValueChange={(value) => updateStatus(selectedSubmission, value)}
                    disabled={isUpdating}
                  >
                    <SelectTrigger className="w-[150px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pendente">Pendente</SelectItem>
                      <SelectItem value="processando">Processando</SelectItem>
                      <SelectItem value="finalizado">Finalizado</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" onClick={() => downloadSubmissionPDF(selectedSubmission)}>
                    <FileDown className="mr-2 h-4 w-4" />
                    PDF
                  </Button>
                </div>
              )}
            </div>
          </DialogHeader>
          {selectedSubmission && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3 text-lg">Dados do Solicitante</h3>
                <div className="grid gap-3 sm:grid-cols-4">
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-xs text-muted-foreground mb-1">Tipo</p>
                    <p className="font-medium">{selectedSubmission.submissionType === "almoxarifado" ? "Almoxarifado" : "Uniformes"}</p>
                  </div>
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

              {/* Almoxarifado Items */}
              {selectedSubmission.submissionType === "almoxarifado" && (
                <>
                  {selectedSubmission.stationeryItems && selectedSubmission.stationeryItems.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-3 text-lg">Itens de Papelaria</h3>
                      <div className="space-y-2">
                        {selectedSubmission.stationeryItems.map((item, index) => (
                          <div key={index} className="rounded-lg border border-border p-4">
                            <div className="grid gap-3 sm:grid-cols-2">
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">Item</p>
                                <p className="font-medium">{item.item}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">Quantidade</p>
                                <p className="font-medium">{item.quantity}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedSubmission.kitchenItems && selectedSubmission.kitchenItems.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-3 text-lg">Itens de Cozinha</h3>
                      <div className="space-y-2">
                        {selectedSubmission.kitchenItems.map((item, index) => (
                          <div key={index} className="rounded-lg border border-border p-4">
                            <div className="grid gap-3 sm:grid-cols-2">
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">Item</p>
                                <p className="font-medium">{item.item}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">Quantidade</p>
                                <p className="font-medium">{item.quantity}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedSubmission.crecheItems && selectedSubmission.crecheItems.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-3 text-lg">Itens de Creche</h3>
                      <div className="space-y-2">
                        {selectedSubmission.crecheItems.map((item, index) => (
                          <div key={index} className="rounded-lg border border-border p-4">
                            <div className="grid gap-3 sm:grid-cols-2">
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">Item</p>
                                <p className="font-medium">{item.item}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">Quantidade</p>
                                <p className="font-medium">{item.quantity}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Uniform Items */}
              {selectedSubmission.submissionType !== "almoxarifado" && (
                <>
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

                  {selectedSubmission.studentKits && selectedSubmission.studentKits.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-3 text-lg">Kits de Aluno</h3>
                      <div className="space-y-2">
                        {selectedSubmission.studentKits.map((kit, index) => (
                          <div key={index} className="rounded-lg border border-border p-4">
                            <div className="grid gap-3 sm:grid-cols-2">
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">Tamanho</p>
                                <p className="font-medium">{kit.size}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">Quantidade</p>
                                <p className="font-medium">{kit.quantity}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedSubmission.teacherPolos && selectedSubmission.teacherPolos.length > 0 && (
                    <>
                      {selectedSubmission.teacherPolos.some((p) => p.kit && p.kitQuantity) && (
                        <div>
                          <h3 className="font-semibold mb-3 text-lg">Kit de Professor</h3>
                          <div className="space-y-2">
                            {selectedSubmission.teacherPolos.filter((p) => p.kit && p.kitQuantity).map((polo, index) => (
                              <div key={index} className="rounded-lg border border-border p-4">
                                <div className="grid gap-3 sm:grid-cols-2">
                                  <div>
                                    <p className="text-xs text-muted-foreground mb-1">Kit</p>
                                    <p className="font-medium">{polo.kit}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground mb-1">Quantidade</p>
                                    <p className="font-medium">{polo.kitQuantity}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {selectedSubmission.teacherPolos.some((p) => p.size && p.quantity) && (
                        <div>
                          <h3 className="font-semibold mb-3 text-lg">Polo de Professor</h3>
                          <div className="space-y-2">
                            {selectedSubmission.teacherPolos.filter((p) => p.size && p.quantity).map((polo, index) => (
                              <div key={index} className="rounded-lg border border-border p-4">
                                <div className="grid gap-3 sm:grid-cols-2">
                                  <div>
                                    <p className="text-xs text-muted-foreground mb-1">Tamanho da Polo</p>
                                    <p className="font-medium">{polo.size}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground mb-1">Quantidade</p>
                                    <p className="font-medium">{polo.quantity}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {selectedSubmission.backpacks && selectedSubmission.backpacks.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-3 text-lg">Mochila</h3>
                      <div className="space-y-2">
                        {selectedSubmission.backpacks.map((backpack, index) => (
                          <div key={index} className="rounded-lg border border-border p-4">
                            <div className="grid gap-3 sm:grid-cols-2">
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">Tamanho</p>
                                <p className="font-medium">{backpack.size}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">Quantidade</p>
                                <p className="font-medium">{backpack.quantity}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir a solicitação de{" "}
              <span className="font-semibold">{submissionToDelete?.name}</span>? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)} disabled={isDeleting}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={deleteSubmission} disabled={isDeleting}>
              {isDeleting ? "Excluindo..." : "Excluir"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showFeedbackDetailModal} onOpenChange={setShowFeedbackDetailModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle>Detalhes do Feedback</DialogTitle>
                <DialogDescription>
                  Enviado em {selectedFeedback && new Date(selectedFeedback.created_at).toLocaleString("pt-BR")}
                </DialogDescription>
              </div>
              {selectedFeedback && (
                <Select
                  value={selectedFeedback.status || "pendente"}
                  onValueChange={(value) => {
                    updateFeedbackStatus(selectedFeedback.id, value)
                    setSelectedFeedback({ ...selectedFeedback, status: value })
                  }}
                >
                  <SelectTrigger className="w-[130px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="lido">Lido</SelectItem>
                    <SelectItem value="resolvido">Resolvido</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </DialogHeader>
          {selectedFeedback && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-xs text-muted-foreground mb-1">Instituicao</p>
                  <p className="font-medium">{selectedFeedback.institution}</p>
                </div>
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-xs text-muted-foreground mb-1">Categoria</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(selectedFeedback.category)}`}>
                    {getCategoryLabel(selectedFeedback.category)}
                  </span>
                </div>
              </div>
              <div className="rounded-lg border p-4">
                <p className="text-xs text-muted-foreground mb-2">Mensagem</p>
                <p className="text-sm whitespace-pre-wrap">{selectedFeedback.message}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteFeedbackModal} onOpenChange={setShowDeleteFeedbackModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o feedback de{" "}
              <span className="font-semibold">{feedbackToDelete?.institution}</span>? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowDeleteFeedbackModal(false)} disabled={isDeletingFeedback}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={deleteFeedback} disabled={isDeletingFeedback}>
              {isDeletingFeedback ? "Excluindo..." : "Excluir"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  )
}
