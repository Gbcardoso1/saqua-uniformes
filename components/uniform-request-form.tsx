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

type StudentKitItem = {
  id: number
  size: string
  quantity: string
}

type TeacherPoloItem = {
  id: number
  kit: string
  kitQuantity: string
  size: string
  quantity: string
}

type BackpackItem = {
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

const studentKitSizes = [
  { value: "KIT CRECHE", label: "KIT CRECHE" },
  { value: "KIT PRÉ", label: "KIT PRÉ" },
  { value: "KIT 1º E 2º", label: "KIT 1º E 2º" },
  { value: "KIT 3º AO 5º", label: "KIT 3º AO 5º" },
  { value: "KIT 6º AO 9º", label: "KIT 6º AO 9º" },
  { value: "KIT EJA", label: "KIT EJA" },
]

const teacherPoloSizes = [
  { value: "P", label: "P" },
  { value: "M", label: "M" },
  { value: "G", label: "G" },
  { value: "GG", label: "GG" },
  { value: "EXG", label: "EXG" },
]

const backpackSizes = [
  { value: "Educação Infantil", label: "Educação Infantil" },
  { value: "Fundamental", label: "Fundamental" },
]

const teacherKitOptions = [
  { value: "Kit de Professor", label: "Kit de Professor" },
]

export default function UniformRequestForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    matricula: "",
    institution: "",
  })

  const [uniforms, setUniforms] = useState<UniformItem[]>([{ id: 1, type: "", gender: "", size: "", quantity: "" }])
  const [shoes, setShoes] = useState<ShoeItem[]>([{ id: 1, size: "", quantity: "" }])
  const [studentKits, setStudentKits] = useState<StudentKitItem[]>([{ id: 1, size: "", quantity: "" }])
  const [teacherPolos, setTeacherPolos] = useState<TeacherPoloItem[]>([{ id: 1, kit: "", kitQuantity: "", size: "", quantity: "" }])
  const [backpacks, setBackpacks] = useState<BackpackItem[]>([{ id: 1, size: "", quantity: "" }])

  const [showModal, setShowModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [nextUniformId, setNextUniformId] = useState(2)
  const [nextShoeId, setNextShoeId] = useState(2)
  const [nextStudentKitId, setNextStudentKitId] = useState(2)
  const [nextTeacherPoloId, setNextTeacherPoloId] = useState(2)
  const [nextBackpackId, setNextBackpackId] = useState(2)
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

  const addStudentKit = () => {
    setStudentKits([...studentKits, { id: nextStudentKitId, size: "", quantity: "" }])
    setNextStudentKitId(nextStudentKitId + 1)
  }

  const removeStudentKit = (id: number) => {
    if (studentKits.length > 1) {
      setStudentKits(studentKits.filter((k) => k.id !== id))
    }
  }

  const updateStudentKit = (id: number, field: keyof StudentKitItem, value: string) => {
    setStudentKits(studentKits.map((k) => (k.id === id ? { ...k, [field]: value } : k)))
  }

  const addTeacherPolo = () => {
    setTeacherPolos([...teacherPolos, { id: nextTeacherPoloId, kit: "", kitQuantity: "", size: "", quantity: "" }])
    setNextTeacherPoloId(nextTeacherPoloId + 1)
  }

  const removeTeacherPolo = (id: number) => {
    if (teacherPolos.length > 1) {
      setTeacherPolos(teacherPolos.filter((p) => p.id !== id))
    }
  }

  const updateTeacherPolo = (id: number, field: keyof TeacherPoloItem, value: string) => {
    setTeacherPolos(teacherPolos.map((p) => (p.id === id ? { ...p, [field]: value } : p)))
  }

  const addBackpack = () => {
    setBackpacks([...backpacks, { id: nextBackpackId, size: "", quantity: "" }])
    setNextBackpackId(nextBackpackId + 1)
  }

  const removeBackpack = (id: number) => {
    if (backpacks.length > 1) {
      setBackpacks(backpacks.filter((b) => b.id !== id))
    }
  }

  const updateBackpack = (id: number, field: keyof BackpackItem, value: string) => {
    setBackpacks(backpacks.map((b) => (b.id === id ? { ...b, [field]: value } : b)))
  }

  const validateForm = (): boolean => {
    if (!formData.name || !formData.matricula || !formData.institution) {
      alert("Por favor, preencha os campos obrigatórios: Nome do Solicitante, Matrícula e Nome da Instituição de Ensino.")
      return false
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
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          matricula: formData.matricula,
          institution: formData.institution,
          uniforms: uniforms,
          shoes: shoes,
          studentKits: studentKits,
          teacherPolos: teacherPolos,
          backpacks: backpacks,
        }),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || "Failed to submit")
      }

      setShowModal(false)
      setShowSuccessModal(true)

      // Reset form
      setFormData({ name: "", matricula: "", institution: "" })
      setUniforms([{ id: 1, type: "", gender: "", size: "", quantity: "" }])
      setShoes([{ id: 1, size: "", quantity: "" }])
      setStudentKits([{ id: 1, size: "", quantity: "" }])
      setTeacherPolos([{ id: 1, kit: "", kitQuantity: "", size: "", quantity: "" }])
      setBackpacks([{ id: 1, size: "", quantity: "" }])
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

    yPos += 6

    // Kits de Aluno
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("KITS DE ALUNO", 20, yPos)
    yPos += 7

    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    studentKits.forEach((k, i) => {
      if (yPos > 270) {
        doc.addPage()
        yPos = 20
      }
      doc.text(`${i + 1}. Tipo: ${k.size} | Quantidade: ${k.quantity}`, 20, yPos)
      yPos += 6
    })

    yPos += 6

    // Kit de Professor - Polo
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("KIT DE PROFESSOR - POLO", 20, yPos)
    yPos += 7

    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    teacherPolos.forEach((p, i) => {
      if (yPos > 270) {
        doc.addPage()
        yPos = 20
      }
doc.text(`${i + 1}. Kit: ${p.kit} | Qtd Kit: ${p.kitQuantity} | Polo: ${p.size} | Qtd: ${p.quantity}`, 20, yPos)
  yPos += 6
    })

    yPos += 6

    // Mochila
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("MOCHILA", 20, yPos)
    yPos += 7

    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    backpacks.forEach((b, i) => {
      if (yPos > 270) {
        doc.addPage()
        yPos = 20
      }
      doc.text(`${i + 1}. Tamanho: ${b.size} | Quantidade: ${b.quantity}`, 20, yPos)
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

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Kits de Aluno</CardTitle>
            <Button type="button" onClick={addStudentKit} size="sm" variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Adicionar
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {studentKits.map((kit) => (
              <div key={kit.id} className="relative rounded-lg border border-border p-4">
                {studentKits.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2"
                    onClick={() => removeStudentKit(kit.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Tipo</Label>
                    <Select value={kit.size} onValueChange={(value) => updateStudentKit(kit.id, "size", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o kit" />
                      </SelectTrigger>
                      <SelectContent>
                        {studentKitSizes.map((size) => (
                          <SelectItem key={size.value} value={size.value}>
                            {size.label}
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
                      value={kit.quantity}
                      onChange={(e) => updateStudentKit(kit.id, "quantity", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Kit de Professor - Polo</CardTitle>
            <Button type="button" onClick={addTeacherPolo} size="sm" variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Adicionar
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {teacherPolos.map((polo) => (
              <div key={polo.id} className="relative rounded-lg border border-border p-4">
                {teacherPolos.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2"
                    onClick={() => removeTeacherPolo(polo.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Selecionar Kit de Professor</Label>
                      <Select value={polo.kit} onValueChange={(value) => updateTeacherPolo(polo.id, "kit", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o kit" />
                        </SelectTrigger>
                        <SelectContent>
                          {teacherKitOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
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
                        value={polo.kitQuantity}
                        onChange={(e) => updateTeacherPolo(polo.id, "kitQuantity", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Tamanho da Polo</Label>
                      <Select value={polo.size} onValueChange={(value) => updateTeacherPolo(polo.id, "size", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tamanho" />
                        </SelectTrigger>
                        <SelectContent>
                          {teacherPoloSizes.map((size) => (
                            <SelectItem key={size.value} value={size.value}>
                              {size.label}
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
                        value={polo.quantity}
                        onChange={(e) => updateTeacherPolo(polo.id, "quantity", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Mochila</CardTitle>
            <Button type="button" onClick={addBackpack} size="sm" variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Adicionar
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {backpacks.map((backpack) => (
              <div key={backpack.id} className="relative rounded-lg border border-border p-4">
                {backpacks.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2"
                    onClick={() => removeBackpack(backpack.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Tamanho da Mochila</Label>
                    <Select value={backpack.size} onValueChange={(value) => updateBackpack(backpack.id, "size", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tamanho" />
                      </SelectTrigger>
                      <SelectContent>
                        {backpackSizes.map((size) => (
                          <SelectItem key={size.value} value={size.value}>
                            {size.label}
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
                      value={backpack.quantity}
                      onChange={(e) => updateBackpack(backpack.id, "quantity", e.target.value)}
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

            <div>
              <h3 className="font-semibold mb-2">Kits de Aluno</h3>
              <div className="space-y-2">
                {studentKits.map((kit, index) => (
                  <div key={kit.id} className="rounded-lg bg-muted p-3 text-sm">
                    <p className="font-medium">Item {index + 1}</p>
                    <p>
                      Tipo: {kit.size} | Quantidade: {kit.quantity}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Kit de Professor - Polo</h3>
              <div className="space-y-2">
                {teacherPolos.map((polo, index) => (
<div key={polo.id} className="rounded-lg bg-muted p-3 text-sm">
  <p className="font-medium">Item {index + 1}</p>
  <p>Kit: {polo.kit} | Qtd Kit: {polo.kitQuantity}</p>
  <p>Tamanho da Polo: {polo.size} | Quantidade: {polo.quantity}</p>
  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Mochila</h3>
              <div className="space-y-2">
                {backpacks.map((backpack, index) => (
                  <div key={backpack.id} className="rounded-lg bg-muted p-3 text-sm">
                    <p className="font-medium">Item {index + 1}</p>
                    <p>
                      Tamanho: {backpack.size} | Quantidade: {backpack.quantity}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {!pdfDownloaded && (
              <div className="rounded-lg border-2 border-yellow-500 bg-yellow-50 p-4">
                <p className="text-sm text-yellow-800 font-medium flex items-center gap-2">
                  <span className="text-yellow-600">⚠</span>
                  É necessário baixar o PDF antes de confirmar o envio.
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                Voltar
              </Button>
              <Button type="button" variant="secondary" onClick={downloadPDF}>
                <Download className="mr-2 h-4 w-4" />
                {pdfDownloaded ? "PDF Baixado" : "Baixar PDF"}
              </Button>
              <Button type="button" onClick={confirmSubmission} disabled={isSubmitting || !pdfDownloaded}>
                {isSubmitting ? "Enviando..." : "Confirmar Envio"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Solicitação Enviada!</DialogTitle>
            <DialogDescription>Sua solicitação foi enviada com sucesso e está sendo processada.</DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button onClick={() => setShowSuccessModal(false)}>Fechar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
