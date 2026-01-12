"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus, Trash2, Download } from "lucide-react"

type UniformItem = {
  id: number
  type: string
  gender: string
  size: string
  quantity: string
}

type ShoeItem = {
  id: number
  size: string
  quantity: string
}

type FormData = {
  name: string
  matricula: string
  institution: string
}

const uniformTypes = [
  { value: "Creche", label: "Creche" },
  { value: "Pré", label: "Pré" },
  { value: "1º-5º", label: "1º ao 5º ano" },
  { value: "6º-9º", label: "6º ao 9º ano" },
  { value: "EJA", label: "EJA" },
]

const allUniformSizes = ["6/12 meses", "1", "2", "3", "P", "M", "G", "GG", "XG", "4", "6", "8", "10", "12", "14", "16"]

const genders = [
  { value: "Masculino", label: "Masculino" },
  { value: "Feminino", label: "Feminino" },
]

const shoeSizes = Array.from({ length: 28 }, (_, i) => (i + 18).toString())

export default function UniformRequestForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    matricula: "",
    institution: "",
  })

  const [uniforms, setUniforms] = useState<UniformItem[]>([{ id: 1, type: "", gender: "", size: "", quantity: "" }])

  const [shoes, setShoes] = useState<ShoeItem[]>([{ id: 1, size: "", quantity: "" }])

  const [showModal, setShowModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [nextUniformId, setNextUniformId] = useState(2)
  const [nextShoeId, setNextShoeId] = useState(2)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [pdfDownloaded, setPdfDownloaded] = useState(false)

  const addUniform = () => {
    setUniforms([...uniforms, { id: nextUniformId, type: "", gender: "", size: "", quantity: "" }])
    setNextUniformId(nextUniformId + 1)
  }

  const removeUniform = (id: number) => {
    if (uniforms.length > 1) {
      setUniforms(uniforms.filter((u) => u.id !== id))
    }
  }

  const updateUniform = (id: number, field: keyof UniformItem, value: string) => {
    setUniforms(
      uniforms.map((u) => {
        if (u.id === id) {
          return { ...u, [field]: value }
        }
        return u
      }),
    )
  }

  const addShoe = () => {
    setShoes([...shoes, { id: nextShoeId, size: "", quantity: "" }])
    setNextShoeId(nextShoeId + 1)
  }

  const removeShoe = (id: number) => {
    if (shoes.length > 1) {
      setShoes(shoes.filter((s) => s.id !== id))
    }
  }

  const updateShoe = (id: number, field: keyof ShoeItem, value: string) => {
    setShoes(shoes.map((s) => (s.id === id ? { ...s, [field]: value } : s)))
  }

  const validateForm = (): boolean => {
    if (!formData.name || !formData.matricula || !formData.institution) {
      alert("Por favor, preencha todos os campos do solicitante.")
      return false
    }

    for (const uniform of uniforms) {
      if (!uniform.type || !uniform.gender || !uniform.size || !uniform.quantity) {
        alert("Por favor, preencha todos os campos dos uniformes.")
        return false
      }
      const qty = Number.parseInt(uniform.quantity)
      if (qty < 1) {
        alert("A quantidade de uniformes deve ser maior que 0.")
        return false
      }
    }

    for (const shoe of shoes) {
      if (!shoe.size || !shoe.quantity) {
        alert("Por favor, preencha todos os campos dos calçados.")
        return false
      }
      const qty = Number.parseInt(shoe.quantity)
      if (qty < 1) {
        alert("A quantidade de calçados deve ser maior que 0.")
        return false
      }
    }

    return true
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      setPdfDownloaded(false)
      setShowModal(true)
    }
  }

  const confirmSubmission = async () => {
    if (!pdfDownloaded) {
      alert("Por favor, baixe o PDF antes de confirmar o envio.")
      return
    }

    setIsSubmitting(true)
    try {
      const submission = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        name: formData.name,
        matricula: formData.matricula,
        institution: formData.institution,
        uniforms: uniforms,
        shoes: shoes,
      }

      // Recuperar submissões existentes do localStorage
      const existingSubmissions = localStorage.getItem("uniformSubmissions")
      const submissions = existingSubmissions ? JSON.parse(existingSubmissions) : []

      // Adicionar nova submissão
      submissions.push(submission)

      // Salvar de volta no localStorage
      localStorage.setItem("uniformSubmissions", JSON.stringify(submissions))

      setShowModal(false)
      setShowSuccessModal(true)

      // Reset form
      setFormData({ name: "", matricula: "", institution: "" })
      setUniforms([{ id: 1, type: "", gender: "", size: "", quantity: "" }])
      setShoes([{ id: 1, size: "", quantity: "" }])
      setPdfDownloaded(false)
    } catch (error) {
      console.error("Error submitting form:", error)
      alert("Erro ao enviar solicitação. Tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const downloadPDF = async () => {
    const { jsPDF } = await import("jspdf")

    const doc = new jsPDF()

    // Add title
    doc.setFontSize(18)
    doc.setFont("helvetica", "bold")
    doc.text("SOLICITAÇÃO DE UNIFORMES E CALÇADOS", 105, 20, { align: "center" })

    // Add horizontal line
    doc.setLineWidth(0.5)
    doc.line(20, 25, 190, 25)

    // Dados do Solicitante
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("DADOS DO SOLICITANTE", 20, 35)

    doc.setFontSize(11)
    doc.setFont("helvetica", "normal")
    let yPos = 42
    doc.text(`Nome: ${formData.name}`, 20, yPos)
    yPos += 7
    doc.text(`Matrícula: ${formData.matricula}`, 20, yPos)
    yPos += 7
    doc.text(`Instituição: ${formData.institution}`, 20, yPos)
    yPos += 12

    // Uniformes
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("UNIFORMES", 20, yPos)
    yPos += 7

    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    uniforms.forEach((u, i) => {
      if (yPos > 270) {
        doc.addPage()
        yPos = 20
      }
      doc.text(`${i + 1}. Tipo: ${u.type} | Gênero: ${u.gender} | Tamanho: ${u.size} | Qtd: ${u.quantity}`, 20, yPos)
      yPos += 6
    })

    yPos += 6

    // Calçados
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("CALÇADOS (TÊNIS)", 20, yPos)
    yPos += 7

    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    shoes.forEach((s, i) => {
      if (yPos > 270) {
        doc.addPage()
        yPos = 20
      }
      doc.text(`${i + 1}. Tamanho: ${s.size} | Quantidade: ${s.quantity}`, 20, yPos)
      yPos += 6
    })

    // Add date
    yPos += 10
    if (yPos > 270) {
      doc.addPage()
      yPos = 20
    }
    doc.setFontSize(9)
    doc.text(`Data: ${new Date().toLocaleDateString("pt-BR")}`, 20, yPos)

    // Save PDF
    doc.save(`solicitacao-${formData.name.replace(/\s+/g, "-")}-${Date.now()}.pdf`)

    setPdfDownloaded(true)
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Dados do Solicitante</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Solicitante</Label>
                <Input
                  id="name"
                  placeholder="Digite seu nome completo"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="matricula">Matrícula</Label>
                <Input
                  id="matricula"
                  placeholder="Digite a matrícula"
                  value={formData.matricula}
                  onChange={(e) => setFormData({ ...formData, matricula: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="institution">Nome da Instituição de Ensino</Label>
                <Input
                  id="institution"
                  placeholder="Nome da instituição"
                  value={formData.institution}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Uniformes</CardTitle>
            <Button type="button" onClick={addUniform} size="sm" variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Adicionar
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {uniforms.map((uniform) => (
              <div key={uniform.id} className="relative rounded-lg border border-border p-4">
                {uniforms.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2"
                    onClick={() => removeUniform(uniform.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="space-y-2">
                    <Label>Tipo</Label>
                    <Select value={uniform.type} onValueChange={(value) => updateUniform(uniform.id, "type", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {uniformTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Gênero</Label>
                    <Select
                      value={uniform.gender}
                      onValueChange={(value) => updateUniform(uniform.id, "gender", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {genders.map((gender) => (
                          <SelectItem key={gender.value} value={gender.value}>
                            {gender.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Tamanho</Label>
                    <Select value={uniform.size} onValueChange={(value) => updateUniform(uniform.id, "size", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {allUniformSizes.map((size) => (
                          <SelectItem key={size} value={size}>
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Quantidade</Label>
                    <Input
                      type="number"
                      min="1"
                      placeholder="0"
                      value={uniform.quantity}
                      onChange={(e) => updateUniform(uniform.id, "quantity", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Calçados</CardTitle>
            <Button type="button" onClick={addShoe} size="sm" variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Adicionar
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {shoes.map((shoe) => (
              <div key={shoe.id} className="relative rounded-lg border border-border p-4">
                {shoes.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2"
                    onClick={() => removeShoe(shoe.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Tamanho</Label>
                    <Select value={shoe.size} onValueChange={(value) => updateShoe(shoe.id, "size", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {shoeSizes.map((size) => (
                          <SelectItem key={size} value={size}>
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Quantidade</Label>
                    <Input
                      type="number"
                      min="1"
                      placeholder="0"
                      value={shoe.quantity}
                      onChange={(e) => updateShoe(shoe.id, "quantity", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Button type="submit" size="lg" className="min-w-[200px]">
            Enviar Solicitação
          </Button>
        </div>
      </form>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Resumo da Solicitação</DialogTitle>
            <DialogDescription>Verifique os dados da sua solicitação abaixo</DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Dados do Solicitante</h3>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="font-medium">Nome:</span> {formData.name}
                </p>
                <p>
                  <span className="font-medium">Matrícula:</span> {formData.matricula}
                </p>
                <p>
                  <span className="font-medium">Instituição:</span> {formData.institution}
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Uniformes</h3>
              <div className="space-y-2">
                {uniforms.map((uniform, index) => (
                  <div key={uniform.id} className="rounded-lg bg-muted p-3 text-sm">
                    <p className="font-medium">Item {index + 1}</p>
                    <p>
                      Tipo: {uniform.type} | Gênero: {uniform.gender} | Tamanho: {uniform.size} | Quantidade:{" "}
                      {uniform.quantity}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Calçados (Tênis)</h3>
              <div className="space-y-2">
                {shoes.map((shoe, index) => (
                  <div key={shoe.id} className="rounded-lg bg-muted p-3 text-sm">
                    <p className="font-medium">Item {index + 1}</p>
                    <p>
                      Tamanho: {shoe.size} | Quantidade: {shoe.quantity}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {!pdfDownloaded && (
              <div className="rounded-lg bg-amber-50 border border-amber-200 p-4">
                <div className="flex items-start gap-3">
                  <svg
                    className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <div>
                    <p className="font-semibold text-amber-800 text-sm">Atenção</p>
                    <p className="text-amber-700 text-sm mt-1">
                      É necessário baixar o PDF antes de confirmar o envio da solicitação.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowModal(false)} disabled={isSubmitting}>
                Voltar
              </Button>
              <Button variant="outline" onClick={downloadPDF} disabled={isSubmitting}>
                <Download className="mr-2 h-4 w-4" />
                {pdfDownloaded ? "PDF Baixado ✓" : "Baixar PDF"}
              </Button>
              <Button onClick={confirmSubmission} disabled={isSubmitting || !pdfDownloaded}>
                {isSubmitting ? "Enviando..." : "Confirmar Envio"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Solicitação Enviada com Sucesso!</DialogTitle>
            <DialogDescription>
              Sua solicitação de uniformes e calçados foi registrada e será processada em breve.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-4">
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <div className="flex justify-center">
            <Button onClick={() => setShowSuccessModal(false)}>Fechar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
