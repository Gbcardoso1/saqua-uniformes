"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { CheckCircle, Plus, Trash2, Download } from "lucide-react"
import { jsPDF } from "jspdf"

// Itens de Papelaria
const stationeryItems = [
  "AGENDA ESCOLAR [ PRE - ESCOLA 2024 ]",
  "ALMOFADA P/ CARIMBO N 3 PRETA - UND.",
  "APAGADOR PARA QUADRO BRANCO",
  "APONTADOR BLOCO - 4CM UND.",
  "AVENTAL INFANTIL (KIT ESCOLAR)",
  "BASTAO DE COLA QUENTE (FINA) C/ 10 UND.",
  "BASTAO DE COLA QUENTE (GROSSA) C/ 10 UND.",
  "BLOCO ADESIVO 76 MM X 76MM - C/ 100 FLS.",
  "BLOCO ADESIVO COLORIDO NEON 38MM X 50MM - 4 BLOCOS C/ 100 FLS.",
  "BORRACHA BRANCA - CX/24 UND.",
  "CADERNO 10 MATERIAS (KIT ESCOLAR 2025)",
  "CADERNO 10 MATERIAS PROFESSOR (KIT ESCOLAR).",
  "CADERNO BROCHURA COSTURADO - CAPA DURA 96 FLS (KIT ESCOLAR 2025).",
  "CADERNO DE CALIGRAFIA GRAMPEADO 1/4 (KIT ESCOLAR 2025)",
  "CADERNO DESENHO ESPIRAL - 96 FLS (KIT ESCOLAR 2025)",
  "CADERNO DESENHO GRAMPEADO - 96 FLS (KIT ESCOLAR 2025)",
  "CADERNO MEIA PAUTA 1/4 ESPIRAL (KIT ESCOLAR 2025)",
  "CANETA AZUL EMB. C/10 UND (KIT ESCOLAR).",
  "CANETA ESFEROGRAFICA INJEXPEN 0.5 - AZUL - CX/50 UND.",
  "CANETA ESFEROGRAFICA INJEXPEN 0.5 - PRETO - CX/50 UND.",
  "CANETA ESFEROGRAFICA INJEXPEN 0.5 - VERMELHO - CX/50 UND.",
  "CANETA ESFEROGRAFICA SIMPLES AZUL - CX/50 UND.",
  "CANETA ESFEROGRAFICA SIMPLES VERMELHA - CX/50 UND.",
  "CANETA HIDROGRAFICA PLUS - CX/C 12 CORES.",
  "CANETA PRETA EMB. C/10 UND (KIT ESCOLAR).",
  "CANETA VERMELHA EMB. C/10 UND (KIT ESCOLAR).",
  "CHAMEQUINHO 210MM X 297MM C/ 100 FLS - AMARELO.",
  "CHAMEQUINHO 210MM X 297MM C/ 100 FLS - AZUL.",
  "CHAMEQUINHO 210MM X 297MM C/ 100 FLS - BRANCO.",
  "CHAMEQUINHO 210MM X 297MM C/ 100 FLS - ROSA.",
  "CHAMEQUINHO 210MM X 297MM C/ 100 FLS - VERDE.",
  "COLA BRANCA 90G UND.",
  "COLA COLORIDA PACOTE COM 6 CORES DE 25G",
  "COLA EM BASTAO - 10G - 12 UND.",
  "COMPASSO (KIT ESCOLAR 2025)",
  "CONJ. DE REGUAS (KIT ESCOLAR)",
  "CORRETIVO FITA 5MMX6M UND.",
  "CORRETIVO LIQUIDO 18 ML UND.",
  "ESTILETE LARGO PLASTICO 18MM UND.",
  "ETIQUETA ADESIVA 25,4X66,7 - 30 UND. POR FOLHA - 100 FOLHAS",
  "ETIQUETA ADESIVA 33,9X101,6 - 14 UND. POR FOLHA - 100 FOLHAS",
  "EVA GLITTER - AZUL ROYAL - 5 FLS.",
  "EVA GLITTER - LARANJA - 5 FLS.",
  "EVA GLITTER - LILAS - 05 FLS",
  "EVA GLITTER - OURO - 5 FLS.",
  "EVA GLITTER - PRATA - 5 FLS.",
  "EVA GLITTER - PRETO - 5 FLS.",
  "EVA GLITTER - ROSA - 5 FLS.",
  "EVA GLITTER - VERDE - 5 FLS.",
  "EVA GLITTER - VERMELHO - 05 FLS",
  "EVA LISO - AMARELO - 5 FLS.",
  "EVA LISO - ROSA - 5 FLS.",
  "EVA LISO - VERDE GRAMA - 5 FLS.",
  "EVA LISO - VERMELHO FOGO - 5 FLS.",
  "EVA LISO- AZUL CLARO - 5 FLS.",
  "EVA LISO- AZUL ESCURO - 5 FLS.",
  "EVA LISO- BRANCO - 5 FLS.",
  "EVA LISO- LARANJA - 5 FLS.",
  "EVA LISO- LILAS - 5 FLS.",
  "EVA LISO- MARROM - 5 FLS.",
  "EVA LISO- PELE - 5 FLS.",
  "EVA LISO- PRETO - 5 FLS.",
  "EVA LISO- VERDE - 5 FLS.",
  "EXTRATOR DE GRAMPOS ESPATULA UND.",
  "FITA CREPE 18MM X 10MT - UND.",
  "FITA DUPLA FACE 12MM X 10MT - UND.",
  "FITA PP TRANSPARENTE 45MM X 30MT - UND.",
  "GABARITO GEOMETRICO UND.",
  "GIZ DE CERA BIG - 12 CORES",
  "GRAFITE 0,9MM (KIT ESCOLAR)",
  "GRAMPEADOR ATE 30 FOLHAS (24/6 OU 26/6)",
  "GRAMPEADOR 240 FOLHAS",
  "GRAMPO 23/10 CX/ C 5.000 UND.",
  "GRAMPO GALVANIZADO 106/6 CX/C 3500 UND.",
  "GRAMPO GALVANIZADO 26/6 CX/5000 UND.",
  "GRAMPO TRILHO PARA PASTA - PLASTICO - 50 UNIDADES",
  "GUACHE 15 ML CX/ C 06 UND.",
  "LAPIS DE COR CAIXA COM 12 CORES ECO - SEXTAVADO",
  "LAPIS PRETO HB N 2 - 10 UND.",
  "LAPIS PRETO HB N 2 - CX /C 144UND.",
  "LAPISEIRA TECNICA HEXAGONAL 0.7 CX/12 UND.",
  "LAPISEIRA TECNICA TRIANGULAR 0.7 CX/12 UND.",
  "MARCA TEXTO AZUL CX/C 12 UND.",
  "MARCA TEXTO ROSA CX/C 12 UND.",
  "MARCA TEXTO SLIM - AMARELO - 12 UND.",
  "MARCA TEXTO VERDE CX/C 12 UND.",
  "MARCA-TEXTO FLUORESCENTE - LARANJA - 12 UND.",
  "MARCADOR QUADRO BRANCO RECARREGAVEL - AZUL - CX/12 UND",
  "MARCADOR QUADRO BRANCO RECARREGAVEL - PRETO - CX/12 UND",
  "MARCADOR QUADRO BRANCO RECARREGAVEL - VERMELHO - CX/12 UND",
  "MARCADOR RETROPROJETOR E CD - PONTA DUPLA 1 E 2 MM - AZUL - CX/12 UND",
  "MARCADOR RETROPROJETOR E CD - PONTA DUPLA 1 E 2 MM - PRETO - CX/12 UND",
  "MASSA DE MODELAR DE AMIDO - 12 CORES",
  "PAPEL 40 KG 66CM X 96CM - BRANCO - 10 UND.",
  "PAPEL CAMURCA AMARELO UND.",
  "PAPEL CAMURCA AZUL CLARO UND.",
  "PAPEL CAMURCA AZUL COBALTO UND.",
  "PAPEL CAMURCA AZUL ESCURO UND.",
  "PAPEL CAMURCA LARANJA UND.",
  "PAPEL CAMURCA LILAS UND.",
  "PAPEL CAMURCA MARROM UND.",
  "PAPEL CAMURCA ROSA CLARO UND.",
  "PAPEL CAMURCA VERDE BANDEIRA UND.",
  "PAPEL CAMURCA VERMELHO UND.",
  "PAPEL CELOFANE - AZUL ESCURO - 1 UND.",
  "PAPEL CELOFANE - INCOLOR - 1 UND.",
  "PAPEL CELOFANE - VERDE - UND.",
  "PAPEL CELOFANE - VERMELHO - 1 UND.",
  "PAPEL CHAMEX A3 297MMX420MM COM 500 FOLHAS",
  "PAPEL CHAMEX A4 210X297MM COM 500 FOLHAS",
  "PAPEL CHAMEX OFICIO 216X330MM COM 500 FOLHAS",
  "PAPEL FOTOGRAFICO BRILHO C/ 10 UND.",
  "PAPEL LAMINADO - AZUL CLARO - 10 FLS",
  "PAPEL LAMINADO - OURO - 10 FLS",
  "PAPEL LAMINADO - PINK - 10 FLS",
  "PAPEL LAMINADO - PRATA - 10 FLS",
  "PAPEL LAMINADO - VERDE - 10 FLS",
  "PAPEL LAMINADO - VERMELHO - 10 FLS",
  "PAPEL MICRO ONDULADO - AZUL CLARO - UND.",
  "PAPEL MICRO ONDULADO - LARANJA - UND.",
  "PAPEL SEDA - BRANCO - 10FLS",
  "PASTA REGISTRADORA 2 ARGOLAS",
  "PERCEVEJO DOURADO C/100 UND.",
  "PERFURADOR DE PAPEL (30 FLS) UND.",
  "PERFURADOR DE PAPEL (65 FLS) - 02 FUROS",
  "PINCEL CHATO LONGO 815-0 - 12 UND",
  "PINCEL CHATO LONGO 815-2 - 12 UND",
  "PINCEL CHATO LONGO 815-4 - 12 UND",
  "PINCEL CHATO LONGO 815-6 - 12 UND",
  "PINTURA DEDO - 6 CORES",
  "PISTOLA APLICADORA COLA QUENTE - GRANDE",
  "PISTOLA APLICADORA COLA QUENTE - PEQUENA.",
  "PLASTICO ADESIVO 50 MICRA - CRISTAL - 45CMX25M",
  "PLASTICO ADESIVO 80 MICRA - AZUL - 45CMX10M",
  "PLASTICO ADESIVO 80 MICRA - VERMELHO - 45CMX10M",
  "REGISTRADORA OFFICE ESTREITO 350 X 280 X 55 MM - KIT C/ 4 PCS",
  "REGUA CRISTAL 30CM",
  "ROLO DE PINTURA UND - (KIT ESCOLAR).",
  "SACO KRAFT NATURAL - 80G - 176X250MM (ENVELOPE) - CX/100 UND",
  "SACO KRAFT NATURAL - 80G - 260X360MM (ENVELOPE) - CX/100 UND",
  "TESOURA MULTIUSO GRANDE - 21CM - UND.",
  "TINTA P/ CARIMBO 40 ML AZUL UND.",
  "TNT AMARELO CANARIO - METRO.",
  "TNT AZUL CLARO - METRO.",
  "TNT AZUL ROYAL - METRO.",
  "TNT BRANCO - METRO.",
  "TNT LARANJA - METRO.",
  "TNT MARROM - METRO.",
  "TNT PINK - METRO.",
  "TNT PRETO - METRO.",
  "TNT ROSA CLARO - METRO.",
  "TNT VERDE BANDEIRA - METRO.",
  "TNT VERMELHO - METRO.",
  "UMEDECEDOR DE DEDOS - 75X21MM - ESPUMA UND.",
]

// Itens de Cozinha
const kitchenItems = [
  "BACIA ALUMINIO - 40",
  "BACIA PLASTICA - 32L",
  "BULE 4,5L",
  "BULE 9L",
  "CAIXA ORGANIZADORA PRETA - 30 LTS",
  "CANECA BRANCA PROFESSOR",
  "CONCHA N 12",
  "FACA DE COZINHA - N 7",
  "FRIGIDEIRA - N 32",
  "FRIGIDEIRA - N 40",
  "PANELA INOX - N 24",
  "PANELA INOX - N 32",
  "PANELA INOX - N 36",
  "PANELA INOX - N 50",
  "TAMPA PANELA INOX - N 24",
  "TAMPA PANELA INOX - N 32",
  "TAMPA PANELA INOX - N 36",
]

const institutions = [
  "Escola Municipal Alfredo Castro",
  "Escola Municipal Alkindar Sento Sé",
  "Escola Municipal Antônio de Alcântara Machado",
  "Escola Municipal Creuza de Paula Bastos Jornalista",
  "Escola Municipal Dr. Oscar Romão",
  "Escola Municipal Guilherme Briggs",
  "Escola Municipal Jacinto Jorge",
  "Escola Municipal Jeny Vieira Gomes Tereza",
  "Escola Municipal José do Patrocínio",
  "Escola Municipal Julio Benedicto",
  "Escola Municipal Maria Nazareth Pacheco R Salles",
  "Escola Municipal Nelita Costa de Araújo",
  "Escola Municipal Professora Izabel Silva Reis",
  "Escola Municipal Saquarema",
  "Escola Municipal Sargento João Délio dos Santos",
  "Escola Municipal Sebastião Mendes de Melo",
  "Escola Municipal Tio Mário",
  "Escola Municipal Valdomiro Rodrigues da Silva",
  "Escola Municipal Vilatur",
  "Escola Municipal Vila Rica",
  "Escola Municipal Walkyria Lange",
  "Creche Escola Municipal Adilson Cardoso de Souza",
  "Creche Escola Municipal Carlos Galvão do Carmo",
  "Creche Escola Municipal Casemiro Meirelles",
  "Creche Escola Municipal Contador Rubens Gonçalves",
  "Creche Escola Municipal Elias Calixto",
  "Creche Escola Municipal Enio de Souza Mello Bittencourt",
  "Creche Escola Municipal Erly Machado",
  "Creche Escola Municipal Graziela Serpa",
  "Creche Escola Municipal Guaraci dos Santos Pontes",
  "Creche Escola Municipal Ignácio Serpa Barbosa",
  "Creche Escola Municipal Jorge Renato Vilhena de Moraes",
  "Creche Escola Municipal José Nogueira Ferraz Filho",
  "Creche Escola Municipal Mario de Oliveira Cony",
  "Creche Escola Municipal Mary de Souza Teixeira",
  "Creche Escola Municipal Paulo Freire",
  "Creche Escola Municipal Silvia Miguez",
  "Creche Escola Municipal Sonia Motta",
]

type StationeryListItem = {
  id: number
  item: string
  quantity: string
}

type KitchenListItem = {
  id: number
  item: string
  quantity: string
}

export default function AlmoxarifadoRequestForm() {
  const [formData, setFormData] = useState({
    name: "",
    matricula: "",
    institution: "",
  })

  const [stationeryItemsList, setStationeryItemsList] = useState<StationeryListItem[]>([{ id: 1, item: "", quantity: "" }])
  const [kitchenItemsList, setKitchenItemsList] = useState<KitchenListItem[]>([{ id: 1, item: "", quantity: "" }])
  const [nextStationeryId, setNextStationeryId] = useState(2)
  const [nextKitchenId, setNextKitchenId] = useState(2)

  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Stationery functions
  const addStationeryItem = () => {
    setStationeryItemsList([...stationeryItemsList, { id: nextStationeryId, item: "", quantity: "" }])
    setNextStationeryId(nextStationeryId + 1)
  }

  const removeStationeryItem = (id: number) => {
    setStationeryItemsList(stationeryItemsList.filter((item) => item.id !== id))
  }

  const updateStationeryItem = (id: number, field: keyof StationeryListItem, value: string) => {
    setStationeryItemsList(stationeryItemsList.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  // Kitchen functions
  const addKitchenItem = () => {
    setKitchenItemsList([...kitchenItemsList, { id: nextKitchenId, item: "", quantity: "" }])
    setNextKitchenId(nextKitchenId + 1)
  }

  const removeKitchenItem = (id: number) => {
    setKitchenItemsList(kitchenItemsList.filter((item) => item.id !== id))
  }

  const updateKitchenItem = (id: number, field: keyof KitchenListItem, value: string) => {
    setKitchenItemsList(kitchenItemsList.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  const generatePDF = () => {
    const doc = new jsPDF()

    // Header
    doc.setFontSize(18)
    doc.setFont("helvetica", "bold")
    doc.text("SOLICITACAO DE ALMOXARIFADO", 105, 20, { align: "center" })

    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    doc.text(`Data: ${new Date().toLocaleDateString("pt-BR")}`, 105, 28, { align: "center" })

    // Personal Info
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.text("DADOS DO SOLICITANTE", 20, 40)
    doc.setFont("helvetica", "normal")
    doc.setFontSize(10)
    doc.text(`Nome: ${formData.name}`, 20, 48)
    doc.text(`Matricula: ${formData.matricula}`, 20, 54)
    doc.text(`Instituicao: ${formData.institution}`, 20, 60)

    let yPos = 75

    // Stationery Items
    const filledStationery = stationeryItemsList.filter((s) => s.item && s.quantity)
    if (filledStationery.length > 0) {
      doc.setFontSize(12)
      doc.setFont("helvetica", "bold")
      doc.text("ITENS DE PAPELARIA", 20, yPos)
      yPos += 8
      doc.setFont("helvetica", "normal")
      doc.setFontSize(10)
      filledStationery.forEach((s, i) => {
        if (yPos > 270) {
          doc.addPage()
          yPos = 20
        }
        doc.text(`${i + 1}. ${s.item} | Qtd: ${s.quantity}`, 20, yPos)
        yPos += 6
      })
      yPos += 5
    }

    // Kitchen Items
    const filledKitchen = kitchenItemsList.filter((k) => k.item && k.quantity)
    if (filledKitchen.length > 0) {
      if (yPos > 250) {
        doc.addPage()
        yPos = 20
      }
      doc.setFontSize(12)
      doc.setFont("helvetica", "bold")
      doc.text("ITENS DE COZINHA", 20, yPos)
      yPos += 8
      doc.setFont("helvetica", "normal")
      doc.setFontSize(10)
      filledKitchen.forEach((k, i) => {
        if (yPos > 270) {
          doc.addPage()
          yPos = 20
        }
        doc.text(`${i + 1}. ${k.item} | Qtd: ${k.quantity}`, 20, yPos)
        yPos += 6
      })
    }

    doc.save(`solicitacao-almoxarifado-${formData.name.replace(/\s+/g, "-")}.pdf`)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const submissionData = {
        ...formData,
        submissionType: "almoxarifado",
        stationeryItems: stationeryItemsList.filter((s) => s.item && s.quantity),
        kitchenItems: kitchenItemsList.filter((k) => k.item && k.quantity),
      }

      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      })

      if (!response.ok) {
        throw new Error("Erro ao enviar solicitação")
      }

      generatePDF()
      setShowSuccessModal(true)

      // Reset form
      setFormData({ name: "", matricula: "", institution: "" })
      setStationeryItemsList([{ id: 1, item: "", quantity: "" }])
      setKitchenItemsList([{ id: 1, item: "", quantity: "" }])
      setNextStationeryId(2)
      setNextKitchenId(2)
    } catch (error) {
      console.error("Error submitting form:", error)
      alert("Erro ao enviar solicitação. Tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
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
                name="name"
                placeholder="Digite seu nome completo"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="matricula">Matrícula</Label>
              <Input
                id="matricula"
                name="matricula"
                placeholder="Digite a matrícula"
                value={formData.matricula}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="institution">Nome da Instituição de Ensino</Label>
              <Input
                id="institution"
                name="institution"
                placeholder="Digite o nome da instituição"
                value={formData.institution}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Itens de Papelaria */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle>Itens de Papelaria</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={addStationeryItem} className="gap-1 bg-transparent">
              <Plus className="h-4 w-4" /> Adicionar Item
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {stationeryItemsList.map((item) => (
              <div key={item.id} className="rounded-lg border border-border bg-muted/50 p-4">
                <div className="flex items-start justify-end mb-2">
                  {stationeryItemsList.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeStationeryItem(item.id)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Item</Label>
                    <Select value={item.item} onValueChange={(value) => updateStationeryItem(item.id, "item", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o item" />
                      </SelectTrigger>
                      <SelectContent>
                        {stationeryItems.map((stationeryItem) => (
                          <SelectItem key={stationeryItem} value={stationeryItem}>
                            {stationeryItem}
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
                      value={item.quantity}
                      onChange={(e) => updateStationeryItem(item.id, "quantity", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

      {/* Itens de Cozinha */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle>Itens de Cozinha</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={addKitchenItem} className="gap-1 bg-transparent">
              <Plus className="h-4 w-4" /> Adicionar Item
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {kitchenItemsList.map((item) => (
              <div key={item.id} className="rounded-lg border border-border bg-muted/50 p-4">
                <div className="flex items-start justify-end mb-2">
                  {kitchenItemsList.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeKitchenItem(item.id)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Item</Label>
                    <Select value={item.item} onValueChange={(value) => updateKitchenItem(item.id, "item", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o item" />
                      </SelectTrigger>
                      <SelectContent>
                        {kitchenItems.map((kitchenItem) => (
                          <SelectItem key={kitchenItem} value={kitchenItem}>
                            {kitchenItem}
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
                      value={item.quantity}
                      onChange={(e) => updateKitchenItem(item.id, "quantity", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Button type="submit" size="lg" className="min-w-[200px]" disabled={isSubmitting}>
            {isSubmitting ? "Enviando..." : "Enviar Solicitação"}
          </Button>
        </div>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <DialogTitle className="text-center">Solicitação Enviada!</DialogTitle>
            <DialogDescription className="text-center">
              Sua solicitação de almoxarifado foi enviada com sucesso. O PDF foi baixado automaticamente.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setShowSuccessModal(false)} className="w-full">
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </form>
  )
}
