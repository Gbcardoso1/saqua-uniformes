"use client"

import type React from "react"
import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { RequestCart, type CartItem } from "@/components/request-cart"
import { Download, Send, ChevronDown, ChevronUp, Search, Pencil, Baby, Users } from "lucide-react"

type FormData = {
  name: string
  matricula: string
  institution: string
}

// Itens de Papelaria organizados por categoria
const stationeryCategories: Record<string, string[]> = {
  "Pincéis e Arte": [
    "PINCEL CHATO LONGO 815-0 - 12 UND",
    "PINCEL CHATO LONGO 815-2 - 12 UND",
    "PINCEL CHATO LONGO 815-4 - 12 UND",
    "PINCEL CHATO LONGO 815-6 - 12 UND",
    "GUACHE 15 ML CX/ C 06 UND.",
    "GUACHE FOSCA 250 ML - AMARELO UND.",
    "GUACHE FOSCA 250 ML - AZUL CLARO UND.",
    "GUACHE FOSCA 250 ML - BRANCO UND.",
    "GUACHE FOSCA 250 ML - PRETO UND.",
    "GUACHE FOSCA 250 ML - VERDE CLARO UND.",
    "GUACHE FOSCA 250 ML - VERMELHO UND.",
    "PINTURA DEDO - 6 CORES",
  ],
  "Canetas e Lápis": [
    "CANETA HIDROGRAFICA PLUS - CX/C 12 CORES.",
    "CANETA AZUL EMB. C/10 UND (KIT ESCOLAR).",
    "CANETA ESFEROGRAFICA INJEXPEN 0.5 - AZUL - CX/50 UND.",
    "CANETA ESFEROGRAFICA INJEXPEN 0.5 - PRETO - CX/50 UND.",
    "CANETA ESFEROGRAFICA INJEXPEN 0.5 - VERMELHO - CX/50 UND.",
    "CANETA ESFEROGRAFICA SIMPLES AZUL - CX/50 UND.",
    "CANETA ESFEROGRAFICA SIMPLES VERMELHA - CX/50 UND.",
    "CANETA PRETA EMB. C/10 UND (KIT ESCOLAR).",
    "CANETA VERMELHA EMB. C/10 UND (KIT ESCOLAR).",
    "LAPIS DE COR CAIXA COM 12 CORES ECO - SEXTAVADO",
    "LAPIS PRETO HB Nº 2 - 10 UND.",
    "LAPIS PRETO HB Nº 2 - CX /C 144UND.",
    "LAPISEIRA TECNICA TRIANGULAR 0.7 CX/12 UND.",
    "GIZ DE CERA BIG - 12 CORES",
    "GRAFITE 0,9MM (KIT ESCOLAR)",
  ],
  "Marcadores e Marca-texto": [
    "MARCA TEXTO VERDE CX/C 12 UND.",
    "MARCA TEXTO AZUL CX/C 12 UND.",
    "MARCA TEXTO ROSA CX/C 12 UND.",
    "MARCA TEXTO SLIM - AMARELO- 12 UND.",
    "MARCA-TEXTO FLUORESCENTE - LARANJA - 12 UND.",
    "MARCADOR QUADRO BRANCO RECARREGAVEL - AZUL - CX/12 UND",
    "MARCADOR QUADRO BRANCO RECARREGAVEL - PRETO - CX/12 UND",
    "MARCADOR QUADRO BRANCO RECARREGAVEL - VERMELHO - CX/12 UND",
    "MARCADOR RETROPROJETOR E CD - PONTA DUPLA 1 E 2 MM - AZUL - CX/12 UND",
    "MARCADOR RETROPROJETOR E CD - PONTA DUPLA 1 E 2 MM - PRETO - CX/12 UND",
    "TINTA PARA MARCADOR DE QUADRO BRANCO 20ML - PRETO",
  ],
  "Cadernos e Blocos": [
    "CADERNO 10 MATERIAS (KIT ESCOLAR 2025 )",
    "CADERNO DE CALIGRAFIA GRAMPEADO 1/4 (KIT ESCOLAR 2025 )",
    "CADERNO DESENHO ESPIRAL - 96 FLS (KIT ESCOLAR 2025 )",
    "CADERNO DESENHO GRAMPEADO - 96 FLS (KIT ESCOLAR 2025 )",
    "BLOCO ADESIVO 76 MM X 76MM - C/ 100 FLS .",
    "BLOCO RASCUNHO COM PAUTA C/100 FLS - UND",
  ],
  "Papéis - Cartolina e Chamequinho": [
    "CARTOLINA AMARELA - 120 GSM 50CMX66CM",
    "CARTOLINA AZUL- 120 GSM 50CMX66CM",
    "CARTOLINA BRANCA - 120 GSM 50CMX66CM UND.",
    "CARTOLINA ROSA - 120 GSM 50CMX66CM",
    "CARTOLINA VERDE- 120 GSM 50CMX66CM UND.",
    "CHAMEQUINHO 210MM X 297MM C/ 100 FLS - AMARELO.",
    "CHAMEQUINHO 210MM X 297MM C/ 100 FLS - AZUL.",
    "CHAMEQUINHO 210MM X 297MM C/ 100 FLS - BRANCO.",
    "CHAMEQUINHO 210MM X 297MM C/ 100 FLS - ROSA.",
    "CHAMEQUINHO 210MM X 297MM C/ 100 FLS - VERDE.",
  ],
  "EVA Glitter": [
    "EVA GLITTER - AZUL ROYAL - 5 FLS.",
    "EVA GLITTER - LARANJA - 5 FLS.",
    "EVA GLITTER - LILAS - 05 FLS",
    "EVA GLITTER - OURO - 5 FLS.",
    "EVA GLITTER - PRATA - 5 FLS.",
    "EVA GLITTER - PRETO - 5 FLS.",
    "EVA GLITTER - ROSA - 5 FLS.",
    "EVA GLITTER - VERDE - 5 FLS.",
    "EVA GLITTER - VERMELHO - 05 FLS",
  ],
  "EVA Liso": [
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
  ],
  "Papel Crepom": [
    "PAPEL CREPOM - AMARELO UND.",
    "PAPEL CREPOM - AZUL CLARO",
    "PAPEL CREPOM - AZUL MEDIO UND.",
    "PAPEL CREPOM - BRANCO UND.",
    "PAPEL CREPOM - CHAMPAGNE UND.",
    "PAPEL CREPOM - LARANJA UND.",
    "PAPEL CREPOM - LILAS UND.",
    "PAPEL CREPOM - MARROM UND.",
    "PAPEL CREPOM - PINK UND.",
    "PAPEL CREPOM - PRETO",
    "PAPEL CREPOM - ROSA UND.",
    "PAPEL CREPOM - VERDE BANDEIRA UND.",
    "PAPEL CREPOM - VERDE LIMAO UND.",
    "PAPEL CREPOM - VERMELHO UND.",
    "PAPEL CREPOM - VIOLETA UND.",
  ],
  "Papel Camurça": [
    "PAPEL CAMURÇA AMARELO UND.",
    "PAPEL CAMURÇA AZUL CLARO UND.",
    "PAPEL CAMURÇA AZUL COBALTO UND.",
    "PAPEL CAMURÇA AZUL ESCURO UND.",
    "PAPEL CAMURÇA LARANJA UND.",
    "PAPEL CAMURÇA LILAS UND.",
    "PAPEL CAMURÇA ROSA CLARO UND.",
    "PAPEL CAMURÇA VERDE BANDEIRA UND.",
    "PAPEL CAMURÇA VERMELHO UND.",
  ],
  "Papel Cartão": [
    "PAPEL CARTAO - BRANCO - 10 FLS",
    "PAPEL CARTAO - VERMELHO - 10 FLS",
    "PAPEL CARTAO FOSCO - AMARELO - 10 FLS",
    "PAPEL CARTAO FOSCO - AZUL CLARO - 10 FLS",
    "PAPEL CARTAO FOSCO - AZUL ESCURO - 10 FLS",
    "PAPEL CARTAO FOSCO - LARANJA - 10 FLS",
    "PAPEL CARTAO FOSCO - LILAS - 10 FLS",
    "PAPEL CARTAO FOSCO - MARROM - 10 FLS",
    "PAPEL CARTAO FOSCO - PINK - 10 FLS",
    "PAPEL CARTAO FOSCO - PRETO - 10 FLS",
    "PAPEL CARTAO FOSCO - ROSA - 10 FLS",
    "PAPEL CARTAO FOSCO - VERDE BANDEIRA - 10 FLS",
    "PAPEL CARTAO FOSCO - VERDE CLARO - 10 FLS",
    "PAPEL CARTAO FOSCO - VIOLETA - 10 FLS",
  ],
  "Papel Laminado": [
    "PAPEL LAMINADO - AZUL CLARO - 10 FLS",
    "PAPEL LAMINADO - OURO - 10 FLS",
    "PAPEL LAMINADO - PINK - 10 FLS",
    "PAPEL LAMINADO - PRATA - 10 FLS",
    "PAPEL LAMINADO - VERDE - 10 FLS",
    "PAPEL LAMINADO - VERMELHO - 10 FLS",
  ],
  "Papel Micro Ondulado": [
    "PAPEL MICRO ONDULADO - AMARELO - UND.",
    "PAPEL MICRO ONDULADO - AZUL CLARO - UND.",
    "PAPEL MICRO ONDULADO - AZUL ESCURO - UND.",
    "PAPEL MICRO ONDULADO - BRANCO - UND.",
    "PAPEL MICRO ONDULADO - LARANJA - UND.",
    "PAPEL MICRO ONDULADO - MARROM - UND.",
    "PAPEL MICRO ONDULADO - PINK - UND.",
    "PAPEL MICRO ONDULADO - PRETO - UND.",
    "PAPEL MICRO ONDULADO - ROSA - UND.",
    "PAPEL MICRO ONDULADO - VERDE BANDEIRA - UND.",
    "PAPEL MICRO ONDULADO - VERDE CLARO - UND.",
    "PAPEL MICRO ONDULADO - VERMELHO - UND.",
  ],
  "Papel Seda": [
    "PAPEL SEDA - AMARELO - 10 FLS",
    "PAPEL SEDA - AZUL CLARO - 10 FLS",
    "PAPEL SEDA - AZUL ESCURO - 10 FLS",
    "PAPEL SEDA - BRANCO - 10FLS",
    "PAPEL SEDA - LARANJA - 10 FLS",
    "PAPEL SEDA - LILAS - 10 FLS",
    "PAPEL SEDA - MARROM - 10 FLS",
    "PAPEL SEDA - PINK - 10 FLS",
    "PAPEL SEDA - PRETO - 10 FLS",
    "PAPEL SEDA - ROSA - 10 FLS",
    "PAPEL SEDA - VERDE BANDEIRA - 10 FLS",
    "PAPEL SEDA - VERDE LIMAO - 10 FLS",
    "PAPEL SEDA - VERMELHO - 10 FLS",
  ],
  "TNT": [
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
  ],
  "Fitas e Colas": [
    "FITA CREPE 18MM X 10MT - UND.",
    "FITA PP TRANSPARENTE 18MM X 50MT - UND.",
    "FITA CREPE 18MM X 50MT - UND.",
    "FITA CREPE 48X50M UND.",
    "FITA DUPLA FACE 12MM X 10MT - UND.",
    "FITA DUPLA FACE 12MM X 30M UND.",
    "FITA DUPLA FACE 48MM X 30M UND.",
    "FITA DUREX 12MM X 40MT - UND.",
    "FITA DUREX 12MM X 65M UND.",
    "FITA PP TRANSPARENTE 45MM X 30MT - UND.",
    "FITA TRANSPARENTE 48MM X 50M UND.",
    "COLA COLORIDA PACOTE COM 6 CORES DE 25G",
    "COLA DE SILICONE LIQUIDA 100ML .",
  ],
  "Grampeadores e Grampos": [
    "GRAMPEADOR ATE 30 FOLHAS (24/6 OU 26/6)",
    "GRAMPEADOR 240 FOLHAS",
    "GRAMPO 23/10 CX/ C 5.000 UND.",
    "GRAMPO GALVANIZADO 106/6 CX/C 3500 UND.",
    "GRAMPO GALVANIZADO 26/6 CX/5000 UND.",
    "GRAMPO TRILHO PARA PASTA - PLASTICO - 50 UNIDADES",
  ],
  "Pastas e Arquivos": [
    "PASTA ARQUIVO MORTO PAPELÃO - UND",
    "PASTA C/ ABA OFICIO SOFT CRISTAL PAC/ COM 10 UND.",
    "PASTA L CRISTAL PAC/ COM 10 UND.",
    "PASTA REGISTRADORA 2 ARGOLAS",
    "PASTA SUSPENSA KRAFT CX C/50 UND.",
  ],
  "Etiquetas e Envelopes": [
    "ETIQUETA ADESIVA 25,4X66,7 - 30 UND. POR FOLHA - 100 FOLHAS",
    "ETIQUETA ADESIVA 33,9X101,6 - 14 UND. POR FOLHA - 100 FOLHAS",
    "SACO KRAFT NATURAL - 80G - 176X250MM (ENVELOPE) - CX/100 UND",
    "SACO KRAFT NATURAL - 80G - 260X360MM (ENVELOPE) - CX/100 UND",
  ],
  "Tintas e Carimbos": [
    "ALMOFADA P/ CARIMBO Nº 3 PRETA - UND.",
    "TINTA P/ CARIMBO 40 ML AZUL UND.",
    "TINTA P/ CARIMBO 40 ML PRETO UND.",
    "TINTA P/ CARIMBO 40 ML VERMELHO UND.",
  ],
  "Outros Materiais": [
    "APONTADOR BLOCO - 4CM UND.",
    "AVENTAL INFANTIL (KIT ESCOLAR)",
    "Bolas de algodão pct com 100g",
    "COMPASSO (KIT ESCOLAR 2025 )",
    "CONJ. DE REGUAS (KIT ESCOLAR)",
    "CORRETIVO LIQUIDO 18 ML UND.",
    "GABARITO GEOMETRICO UND.",
    "PAPEL CHAMEX A3 297MMX420MM COM 500 FOLHAS",
    "PAPEL PARDO 80CMX120CM - 10 UND.",
    "PERCEVEJO DOURADO C/100 UND.",
    "PERFURADOR DE PAPEL (65 FLS) - 02 FUROS",
    "PLASTICO ADESIVO 50 MICRA - CRISTAL - 45CMX25M",
    "REGUA CRISTAL 30CM",
    "UMEDECEDOR DE DEDOS - 75X21MM - ESPUMA UND.",
  ],
}

// Itens de Creche
const crecheItems = [
  "BANHEIRA PARA BEBE",
  "BEBE CONFORTO ATE 13 KG",
  "CAPA PARA BEBE CONFORTO 96CMX65CM",
  "COLCHONETE CASAL",
  "EDREDOM 1,80M X 2,40M",
  "LENCOL DE BERCO C/ ELASTICO LISO 70CM X 1.30M X 15CM UND.",
  "LENCOL DE CASAL C/ ELASTICO UND.",
  "LENCOL DE CASAL S/ ELASTICO UND.",
  "MANTA MICROFIBRA - 2,20 X 1,80 (BRANCO)",
  "MANTA MICROFIBRA - 2,20 X 1,80 (CINZA)",
  "TOALHA DE BANHO BRANCA UND.",
  "TOALHA DE BANHO C/ CAPUZ BRANCA 65CM X 80 CM UND.",
  "TOALHA DE ROSTO BRANCA UND.",
  "TOALHINHA LAVABO UND.",
]

export default function AlmoxarifadoRequestForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    matricula: "",
    institution: "",
  })

  const [stationeryQuantities, setStationeryQuantities] = useState<Record<string, number>>({})
  const [crecheQuantities, setCrecheQuantities] = useState<Record<string, number>>({})

  const [showModal, setShowModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [pdfDownloaded, setPdfDownloaded] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>(
    Object.keys(stationeryCategories).reduce((acc, key) => ({ ...acc, [key]: false }), {})
  )

  const updateStationeryQuantity = (item: string, quantity: number) => {
    setStationeryQuantities(prev => {
      if (quantity <= 0) {
        const { [item]: _, ...rest } = prev
        return rest
      }
      return { ...prev, [item]: quantity }
    })
  }

  const updateCrecheQuantity = (item: string, quantity: number) => {
    setCrecheQuantities(prev => {
      if (quantity <= 0) {
        const { [item]: _, ...rest } = prev
        return rest
      }
      return { ...prev, [item]: quantity }
    })
  }

  const cartItems = useMemo(() => {
    const items: CartItem[] = []

    Object.entries(stationeryQuantities).forEach(([item, qty]) => {
      const category = Object.entries(stationeryCategories).find(([, catItems]) => 
        catItems.includes(item)
      )?.[0] || "Papelaria"
      
      items.push({
        id: `stationery-${item}`,
        category: "Papelaria",
        name: item.length > 40 ? item.substring(0, 40) + "..." : item,
        details: category,
        quantity: qty
      })
    })

    Object.entries(crecheQuantities).forEach(([item, qty]) => {
      items.push({
        id: `creche-${item}`,
        category: "Creche",
        name: item.length > 40 ? item.substring(0, 40) + "..." : item,
        quantity: qty
      })
    })

    return items
  }, [stationeryQuantities, crecheQuantities])

  const removeCartItem = (id: string) => {
    if (id.startsWith("stationery-")) {
      const item = id.replace("stationery-", "")
      setStationeryQuantities(prev => {
        const { [item]: _, ...rest } = prev
        return rest
      })
    } else if (id.startsWith("creche-")) {
      const item = id.replace("creche-", "")
      setCrecheQuantities(prev => {
        const { [item]: _, ...rest } = prev
        return rest
      })
    }
  }

  const clearCart = () => {
    setStationeryQuantities({})
    setCrecheQuantities({})
  }

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({ ...prev, [category]: !prev[category] }))
  }

  const expandAll = () => {
    setExpandedCategories(Object.keys(stationeryCategories).reduce((acc, key) => ({ ...acc, [key]: true }), {}))
  }

  const collapseAll = () => {
    setExpandedCategories(Object.keys(stationeryCategories).reduce((acc, key) => ({ ...acc, [key]: false }), {}))
  }

  const stationeryCount = Object.values(stationeryQuantities).reduce((a, b) => a + b, 0)
  const crecheCount = Object.values(crecheQuantities).reduce((a, b) => a + b, 0)

  const filteredCategories = useMemo(() => {
    if (!searchTerm) return stationeryCategories
    
    const filtered: Record<string, string[]> = {}
    Object.entries(stationeryCategories).forEach(([category, items]) => {
      const filteredItems = items.filter(item => 
        item.toLowerCase().includes(searchTerm.toLowerCase())
      )
      if (filteredItems.length > 0) {
        filtered[category] = filteredItems
      }
    })
    return filtered
  }, [searchTerm])

  const filteredCrecheItems = useMemo(() => {
    if (!searchTerm) return crecheItems
    return crecheItems.filter(item => 
      item.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [searchTerm])

  const validateForm = (): boolean => {
    if (!formData.name || !formData.matricula || !formData.institution) {
      alert("Por favor, preencha os campos obrigatorios.")
      return false
    }
    if (cartItems.length === 0) {
      alert("Por favor, selecione pelo menos um item.")
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

  const getStationeryForAPI = () => {
    return Object.entries(stationeryQuantities).map(([item, qty]) => ({
      item,
      quantity: qty.toString()
    }))
  }

  const getCrecheForAPI = () => {
    return Object.entries(crecheQuantities).map(([item, qty]) => ({
      item,
      quantity: qty.toString()
    }))
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          matricula: formData.matricula,
          institution: formData.institution,
          submissionType: "almoxarifado",
          uniforms: [],
          shoes: [],
          stationeryItems: getStationeryForAPI(),
          crecheItems: getCrecheForAPI(),
        }),
      })

      const result = await response.json()
      if (!result.success) throw new Error(result.error || "Failed to submit")

      setShowModal(false)
      setShowSuccessModal(true)

      setFormData({ name: "", matricula: "", institution: "" })
      clearCart()
      setPdfDownloaded(false)
    } catch (error) {
      console.error("Error submitting form:", error)
      alert("Erro ao enviar solicitacao. Tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const downloadPDF = async () => {
    const { jsPDF } = await import("jspdf")
    const doc = new jsPDF()

    doc.setFontSize(18)
    doc.setFont("helvetica", "bold")
    doc.text("SOLICITACAO DE ALMOXARIFADO", 105, 20, { align: "center" })
    doc.setLineWidth(0.5)
    doc.line(20, 25, 190, 25)

    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("DADOS DO SOLICITANTE", 20, 35)

    doc.setFontSize(11)
    doc.setFont("helvetica", "normal")
    let yPos = 42
    doc.text(`Nome: ${formData.name}`, 20, yPos)
    yPos += 7
    doc.text(`Matricula: ${formData.matricula}`, 20, yPos)
    yPos += 7
    doc.text(`Instituicao: ${formData.institution}`, 20, yPos)
    yPos += 12

    if (Object.keys(stationeryQuantities).length > 0) {
      doc.setFontSize(14)
      doc.setFont("helvetica", "bold")
      doc.text("ITENS DE PAPELARIA", 20, yPos)
      yPos += 7

      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      Object.entries(stationeryQuantities).forEach(([item, qty], i) => {
        if (yPos > 270) { doc.addPage(); yPos = 20 }
        doc.text(`${i + 1}. ${item} | Qtd: ${qty}`, 20, yPos)
        yPos += 6
      })
      yPos += 6
    }

    if (Object.keys(crecheQuantities).length > 0) {
      if (yPos > 250) { doc.addPage(); yPos = 20 }
      doc.setFontSize(14)
      doc.setFont("helvetica", "bold")
      doc.text("ITENS DE CRECHE", 20, yPos)
      yPos += 7

      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      Object.entries(crecheQuantities).forEach(([item, qty], i) => {
        if (yPos > 270) { doc.addPage(); yPos = 20 }
        doc.text(`${i + 1}. ${item} | Qtd: ${qty}`, 20, yPos)
        yPos += 6
      })
    }

    yPos += 10
    if (yPos > 270) { doc.addPage(); yPos = 20 }
    doc.setFontSize(9)
    doc.text(`Data: ${new Date().toLocaleDateString("pt-BR")}`, 20, yPos)

    doc.save(`solicitacao-almoxarifado-${formData.name.replace(/\s+/g, "-")}-${Date.now()}.pdf`)
    setPdfDownloaded(true)
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header com Carrinho */}
        <div className="sticky top-0 z-10 -mx-4 bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Formulario de Requisicao</h2>
              <p className="text-sm text-muted-foreground">Almoxarifado - Materiais Escolares</p>
            </div>
            <RequestCart
              items={cartItems}
              onRemoveItem={removeCartItem}
              onClearCart={clearCart}
              title="Itens Selecionados"
            />
          </div>
        </div>

        {/* Dados do Solicitante */}
        <Card className="border-primary/10">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="h-5 w-5 text-primary" />
              Dados do Solicitante
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">Nome do Solicitante</Label>
                <Input
                  id="name"
                  placeholder="Digite seu nome completo"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-10"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="matricula" className="text-sm font-medium">Matricula</Label>
                <Input
                  id="matricula"
                  placeholder="Digite a matricula"
                  value={formData.matricula}
                  onChange={(e) => setFormData({ ...formData, matricula: e.target.value })}
                  className="h-10"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="institution" className="text-sm font-medium">Instituicao de Ensino</Label>
                <Input
                  id="institution"
                  placeholder="Nome da instituicao"
                  value={formData.institution}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  className="h-10"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Campo de Busca Global */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar itens em todas as categorias..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-11 pl-10"
          />
        </div>

        {/* Abas de Itens */}
        <Tabs defaultValue="papelaria" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 h-auto p-1">
            <TabsTrigger value="papelaria" className="flex items-center gap-2 py-3">
              <Pencil className="h-4 w-4" />
              <span>Papelaria</span>
              {stationeryCount > 0 && <Badge variant="secondary" className="ml-1">{stationeryCount}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="creche" className="flex items-center gap-2 py-3">
              <Baby className="h-4 w-4" />
              <span>Creche</span>
              {crecheCount > 0 && <Badge variant="secondary" className="ml-1">{crecheCount}</Badge>}
            </TabsTrigger>
          </TabsList>

          {/* Tab Papelaria */}
          <TabsContent value="papelaria" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <CardTitle className="text-base">Itens de Papelaria</CardTitle>
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={expandAll}>
                      <ChevronDown className="mr-1 h-3 w-3" /> Expandir
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={collapseAll}>
                      <ChevronUp className="mr-1 h-3 w-3" /> Recolher
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(filteredCategories).map(([category, items]) => {
                  const categoryItemCount = items.reduce((acc, item) => 
                    acc + (stationeryQuantities[item] || 0), 0
                  )
                  
                  return (
                    <Collapsible
                      key={category}
                      open={expandedCategories[category] || searchTerm !== ""}
                      onOpenChange={() => toggleCategory(category)}
                    >
                      <CollapsibleTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          className="w-full justify-between h-12 px-4 hover:bg-primary/5 border"
                        >
                          <div className="flex items-center gap-3">
                            <Pencil className="h-4 w-4 text-primary" />
                            <span className="font-medium text-left">{category}</span>
                            <Badge variant="outline" className="text-xs text-muted-foreground">
                              {items.length}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            {categoryItemCount > 0 && (
                              <Badge className="bg-primary/10 text-primary">
                                {categoryItemCount}
                              </Badge>
                            )}
                            {expandedCategories[category] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </div>
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="pt-3">
                        <div className="rounded-lg border bg-card divide-y">
                          {items.map((item) => {
                            const qty = stationeryQuantities[item] || 0
                            return (
                              <div 
                                key={item} 
                                className="flex items-center justify-between p-3 gap-3 hover:bg-muted/50 transition-colors"
                              >
                                <span className="text-sm flex-1 min-w-0">{item}</span>
                                <Input
                                  type="number"
                                  min="0"
                                  placeholder="0"
                                  value={qty || ""}
                                  onChange={(e) => updateStationeryQuantity(item, parseInt(e.target.value) || 0)}
                                  className="h-9 w-20 text-center shrink-0"
                                />
                              </div>
                            )
                          })}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  )
                })}
                
                {Object.keys(filteredCategories).length === 0 && searchTerm && (
                  <div className="text-center py-8 text-muted-foreground">
                    Nenhum item encontrado para &quot;{searchTerm}&quot;
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Creche */}
          <TabsContent value="creche" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Itens de Creche</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border bg-card divide-y">
                  {filteredCrecheItems.map((item) => {
                    const qty = crecheQuantities[item] || 0
                    return (
                      <div 
                        key={item} 
                        className="flex items-center justify-between p-4 gap-3 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-accent/10 shrink-0">
                            <Baby className="h-4 w-4 text-accent" />
                          </div>
                          <span className="font-medium text-sm">{item}</span>
                        </div>
                        <Input
                          type="number"
                          min="0"
                          placeholder="0"
                          value={qty || ""}
                          onChange={(e) => updateCrecheQuantity(item, parseInt(e.target.value) || 0)}
                          className="h-9 w-20 text-center shrink-0"
                        />
                      </div>
                    )
                  })}
                </div>
                
                {filteredCrecheItems.length === 0 && searchTerm && (
                  <div className="text-center py-8 text-muted-foreground">
                    Nenhum item encontrado para &quot;{searchTerm}&quot;
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Botao Enviar */}
        <div className="sticky bottom-4">
          <Button
            type="submit"
            size="lg"
            className="w-full shadow-lg"
            disabled={cartItems.length === 0}
          >
            <Send className="mr-2 h-4 w-4" />
            Enviar Solicitacao ({cartItems.reduce((acc, item) => acc + item.quantity, 0)} itens)
          </Button>
        </div>
      </form>

      {/* Modal de Confirmacao */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Confirmar Envio</DialogTitle>
            <DialogDescription>
              Revise sua solicitacao. Voce deve baixar o PDF antes de confirmar o envio.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="rounded-lg bg-muted p-4 space-y-2">
              <p><strong>Solicitante:</strong> {formData.name}</p>
              <p><strong>Matricula:</strong> {formData.matricula}</p>
              <p><strong>Instituicao:</strong> {formData.institution}</p>
              <p><strong>Total de Itens:</strong> {cartItems.reduce((acc, item) => acc + item.quantity, 0)}</p>
            </div>
            <Button onClick={downloadPDF} variant="outline" className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Baixar PDF
              {pdfDownloaded && <Badge className="ml-2 bg-green-500">Baixado</Badge>}
            </Button>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button
              className="flex-1"
              onClick={confirmSubmission}
              disabled={!pdfDownloaded || isSubmitting}
            >
              {isSubmitting ? "Enviando..." : "Confirmar Envio"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Sucesso */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-green-600">Solicitacao Enviada!</DialogTitle>
            <DialogDescription>
              Sua solicitacao foi enviada com sucesso e sera processada em breve.
            </DialogDescription>
          </DialogHeader>
          <Button onClick={() => setShowSuccessModal(false)} className="w-full">
            Fechar
          </Button>
        </DialogContent>
      </Dialog>
    </>
  )
}
