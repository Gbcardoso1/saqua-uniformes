"use client"

import type React from "react"
import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Download, Search, ShoppingCart, ChevronDown, ChevronUp, X, Shirt, Package, Users, Backpack } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type FormData = {
  name: string
  matricula: string
  institution: string
}

type CartItem = {
  id: string
  category: string
  name: string
  details?: string
  quantity: number
}

// Uniformes organizados por tipo/série
const uniformCategories = {
  "Creche": {
    genders: ["Masculino", "Feminino"],
    sizes: ["6/12 meses", "1", "2", "3"],
  },
  "Pré": {
    genders: ["Masculino", "Feminino"],
    sizes: ["4", "6", "8"],
  },
  "1º ao 5º ano": {
    genders: ["Masculino", "Feminino"],
    sizes: ["4", "6", "8", "10", "12", "14", "16"],
  },
  "6º ao 9º ano": {
    genders: ["Masculino", "Feminino"],
    sizes: ["P", "M", "G", "GG", "XG"],
  },
  "EJA": {
    genders: ["Masculino", "Feminino"],
    sizes: ["P", "M", "G", "GG", "XG"],
  },
}

// Calçados - tamanhos disponíveis
const shoeSizes = Array.from({ length: 28 }, (_, i) => (i + 18).toString())

// Kits de Aluno
const studentKitTypes = [
  "KIT CRECHE",
  "KIT PRÉ",
  "KIT 1º E 2º",
  "KIT 3º AO 5º",
  "KIT 6º AO 9º",
  "KIT EJA",
]

// Polos de Professor
const teacherPoloSizes = ["P", "M", "G", "GG", "EXG"]

// Mochilas
const backpackTypes = ["Educação Infantil", "Fundamental"]

export default function UniformRequestForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    matricula: "",
    institution: "",
  })

  const [showModal, setShowModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [pdfDownloaded, setPdfDownloaded] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(Object.keys(uniformCategories)))
  const [cartOpen, setCartOpen] = useState(false)

  // Estado para quantidades - chave: "categoria|genero|tamanho"
  const [uniformQuantities, setUniformQuantities] = useState<Record<string, number>>({})
  const [shoeQuantities, setShoeQuantities] = useState<Record<string, number>>({})
  const [kitQuantities, setKitQuantities] = useState<Record<string, number>>({})
  const [poloQuantities, setPoloQuantities] = useState<Record<string, number>>({})
  const [kitPoloQuantity, setKitPoloQuantity] = useState<number>(0)
  const [backpackQuantities, setBackpackQuantities] = useState<Record<string, number>>({})

  // Calcular itens do carrinho
  const cartItems = useMemo(() => {
    const items: CartItem[] = []

    // Uniformes
    Object.entries(uniformQuantities).forEach(([key, qty]) => {
      if (qty > 0) {
        const [category, gender, size] = key.split("|")
        items.push({
          id: `uniform-${key}`,
          category: "Uniformes",
          name: category,
          details: `${gender} - Tam. ${size}`,
          quantity: qty,
        })
      }
    })

    // Calçados
    Object.entries(shoeQuantities).forEach(([size, qty]) => {
      if (qty > 0) {
        items.push({
          id: `shoe-${size}`,
          category: "Calçados",
          name: "Tênis",
          details: `Tam. ${size}`,
          quantity: qty,
        })
      }
    })

    // Kits de Aluno
    Object.entries(kitQuantities).forEach(([kit, qty]) => {
      if (qty > 0) {
        items.push({
          id: `kit-${kit}`,
          category: "Kits de Aluno",
          name: kit,
          quantity: qty,
        })
      }
    })

    // Kit de Professor
    if (kitPoloQuantity > 0) {
      items.push({
        id: "kit-professor",
        category: "Kit Professor",
        name: "Kit de Professor",
        quantity: kitPoloQuantity,
      })
    }

    // Polos
    Object.entries(poloQuantities).forEach(([size, qty]) => {
      if (qty > 0) {
        items.push({
          id: `polo-${size}`,
          category: "Polo Professor",
          name: "Polo",
          details: `Tam. ${size}`,
          quantity: qty,
        })
      }
    })

    // Mochilas
    Object.entries(backpackQuantities).forEach(([type, qty]) => {
      if (qty > 0) {
        items.push({
          id: `backpack-${type}`,
          category: "Mochilas",
          name: "Mochila",
          details: type,
          quantity: qty,
        })
      }
    })

    return items
  }, [uniformQuantities, shoeQuantities, kitQuantities, poloQuantities, kitPoloQuantity, backpackQuantities])

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(category)) {
      newExpanded.delete(category)
    } else {
      newExpanded.add(category)
    }
    setExpandedCategories(newExpanded)
  }

  const expandAll = () => setExpandedCategories(new Set(Object.keys(uniformCategories)))
  const collapseAll = () => setExpandedCategories(new Set())

  const removeFromCart = (itemId: string) => {
    if (itemId.startsWith("uniform-")) {
      const key = itemId.replace("uniform-", "")
      setUniformQuantities((prev) => ({ ...prev, [key]: 0 }))
    } else if (itemId.startsWith("shoe-")) {
      const size = itemId.replace("shoe-", "")
      setShoeQuantities((prev) => ({ ...prev, [size]: 0 }))
    } else if (itemId.startsWith("kit-") && itemId !== "kit-professor") {
      const kit = itemId.replace("kit-", "")
      setKitQuantities((prev) => ({ ...prev, [kit]: 0 }))
    } else if (itemId === "kit-professor") {
      setKitPoloQuantity(0)
    } else if (itemId.startsWith("polo-")) {
      const size = itemId.replace("polo-", "")
      setPoloQuantities((prev) => ({ ...prev, [size]: 0 }))
    } else if (itemId.startsWith("backpack-")) {
      const type = itemId.replace("backpack-", "")
      setBackpackQuantities((prev) => ({ ...prev, [type]: 0 }))
    }
  }

  const validateForm = (): boolean => {
    if (!formData.name || !formData.matricula || !formData.institution) {
      alert("Por favor, preencha os campos obrigatórios: Nome do Solicitante, Matrícula e Nome da Instituição de Ensino.")
      return false
    }
    if (totalItems === 0) {
      alert("Por favor, adicione pelo menos um item à solicitação.")
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

  const prepareSubmissionData = () => {
    const uniforms: Array<{ type: string; gender: string; size: string; quantity: string }> = []
    const shoes: Array<{ size: string; quantity: string }> = []
    const studentKits: Array<{ size: string; quantity: string }> = []
    const teacherPolos: Array<{ kit: string; kitQuantity: string; size: string; quantity: string }> = []
    const backpacks: Array<{ size: string; quantity: string }> = []

    Object.entries(uniformQuantities).forEach(([key, qty]) => {
      if (qty > 0) {
        const [type, gender, size] = key.split("|")
        uniforms.push({ type, gender, size, quantity: qty.toString() })
      }
    })

    Object.entries(shoeQuantities).forEach(([size, qty]) => {
      if (qty > 0) {
        shoes.push({ size, quantity: qty.toString() })
      }
    })

    Object.entries(kitQuantities).forEach(([kit, qty]) => {
      if (qty > 0) {
        studentKits.push({ size: kit, quantity: qty.toString() })
      }
    })

    if (kitPoloQuantity > 0) {
      Object.entries(poloQuantities).forEach(([size, qty]) => {
        if (qty > 0) {
          teacherPolos.push({
            kit: "Kit de Professor",
            kitQuantity: kitPoloQuantity.toString(),
            size,
            quantity: qty.toString(),
          })
        }
      })
      // Se não tem polo mas tem kit, adiciona só o kit
      if (teacherPolos.length === 0) {
        teacherPolos.push({
          kit: "Kit de Professor",
          kitQuantity: kitPoloQuantity.toString(),
          size: "",
          quantity: "0",
        })
      }
    }

    Object.entries(backpackQuantities).forEach(([type, qty]) => {
      if (qty > 0) {
        backpacks.push({ size: type, quantity: qty.toString() })
      }
    })

    return { uniforms, shoes, studentKits, teacherPolos, backpacks }
  }

  const confirmSubmission = async () => {
    if (!pdfDownloaded) {
      alert("Por favor, baixe o PDF antes de confirmar o envio.")
      return
    }

    setIsSubmitting(true)
    try {
      const { uniforms, shoes, studentKits, teacherPolos, backpacks } = prepareSubmissionData()

      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          matricula: formData.matricula,
          institution: formData.institution,
          uniforms,
          shoes,
          studentKits,
          teacherPolos,
          backpacks,
        }),
      })

      const result = await response.json()
      if (!result.success) throw new Error(result.error || "Failed to submit")

      setShowModal(false)
      setShowSuccessModal(true)

      // Reset form
      setFormData({ name: "", matricula: "", institution: "" })
      setUniformQuantities({})
      setShoeQuantities({})
      setKitQuantities({})
      setPoloQuantities({})
      setKitPoloQuantity(0)
      setBackpackQuantities({})
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

    doc.setFontSize(18)
    doc.setFont("helvetica", "bold")
    doc.text("SOLICITAÇÃO DE UNIFORMES E CALÇADOS", 105, 20, { align: "center" })
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
    doc.text(`Matrícula: ${formData.matricula}`, 20, yPos)
    yPos += 7
    doc.text(`Instituição: ${formData.institution}`, 20, yPos)
    yPos += 12

    const { uniforms, shoes, studentKits, teacherPolos, backpacks } = prepareSubmissionData()

    if (uniforms.length > 0) {
      doc.setFontSize(14)
      doc.setFont("helvetica", "bold")
      doc.text("UNIFORMES", 20, yPos)
      yPos += 7
      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      uniforms.forEach((u, i) => {
        if (yPos > 270) { doc.addPage(); yPos = 20 }
        doc.text(`${i + 1}. Tipo: ${u.type} | Gênero: ${u.gender} | Tamanho: ${u.size} | Qtd: ${u.quantity}`, 20, yPos)
        yPos += 6
      })
      yPos += 6
    }

    if (shoes.length > 0) {
      doc.setFontSize(14)
      doc.setFont("helvetica", "bold")
      doc.text("CALÇADOS (TÊNIS)", 20, yPos)
      yPos += 7
      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      shoes.forEach((s, i) => {
        if (yPos > 270) { doc.addPage(); yPos = 20 }
        doc.text(`${i + 1}. Tamanho: ${s.size} | Quantidade: ${s.quantity}`, 20, yPos)
        yPos += 6
      })
      yPos += 6
    }

    if (studentKits.length > 0) {
      doc.setFontSize(14)
      doc.setFont("helvetica", "bold")
      doc.text("KITS DE ALUNO", 20, yPos)
      yPos += 7
      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      studentKits.forEach((k, i) => {
        if (yPos > 270) { doc.addPage(); yPos = 20 }
        doc.text(`${i + 1}. Tipo: ${k.size} | Quantidade: ${k.quantity}`, 20, yPos)
        yPos += 6
      })
      yPos += 6
    }

    if (teacherPolos.length > 0) {
      doc.setFontSize(14)
      doc.setFont("helvetica", "bold")
      doc.text("KIT DE PROFESSOR - POLO", 20, yPos)
      yPos += 7
      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      teacherPolos.forEach((p, i) => {
        if (yPos > 270) { doc.addPage(); yPos = 20 }
        doc.text(`${i + 1}. Kit: ${p.kit} | Qtd Kit: ${p.kitQuantity} | Polo: ${p.size} | Qtd: ${p.quantity}`, 20, yPos)
        yPos += 6
      })
      yPos += 6
    }

    if (backpacks.length > 0) {
      doc.setFontSize(14)
      doc.setFont("helvetica", "bold")
      doc.text("MOCHILA", 20, yPos)
      yPos += 7
      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      backpacks.forEach((b, i) => {
        if (yPos > 270) { doc.addPage(); yPos = 20 }
        doc.text(`${i + 1}. Tamanho: ${b.size} | Quantidade: ${b.quantity}`, 20, yPos)
        yPos += 6
      })
    }

    yPos += 10
    if (yPos > 270) { doc.addPage(); yPos = 20 }
    doc.setFontSize(9)
    doc.text(`Data: ${new Date().toLocaleDateString("pt-BR")}`, 20, yPos)

    doc.save(`solicitacao-${formData.name.replace(/\s+/g, "-")}-${Date.now()}.pdf`)
    setPdfDownloaded(true)
  }

  // Componente do Carrinho
  const CartButton = () => (
    <Sheet open={cartOpen} onOpenChange={setCartOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="lg" className="fixed bottom-6 right-6 z-50 h-14 gap-2 rounded-full shadow-lg">
          <ShoppingCart className="h-5 w-5" />
          <span className="font-semibold">Carrinho</span>
          {totalItems > 0 && (
            <Badge className="ml-1 bg-primary text-primary-foreground">{totalItems}</Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Itens Selecionados ({totalItems})
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-180px)] mt-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <ShoppingCart className="h-12 w-12 mb-4 opacity-50" />
              <p>Nenhum item selecionado</p>
              <p className="text-sm">Adicione itens preenchendo as quantidades</p>
            </div>
          ) : (
            <div className="space-y-3 pr-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-lg border bg-card p-3"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">{item.category}</Badge>
                    </div>
                    <p className="font-medium mt-1">{item.name}</p>
                    {item.details && <p className="text-sm text-muted-foreground">{item.details}</p>}
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-sm">Qtd: {item.quantity}</Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        {cartItems.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 border-t bg-background p-4">
            <Button className="w-full" size="lg" onClick={() => { setCartOpen(false); handleSubmit({ preventDefault: () => {} } as React.FormEvent) }}>
              Enviar Solicitação
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6 pb-24">
        {/* Dados do Solicitante */}
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

        {/* Tabs de Categorias */}
        <Tabs defaultValue="uniformes" className="w-full">
          <TabsList className="grid w-full grid-cols-5 h-auto">
            <TabsTrigger value="uniformes" className="flex flex-col gap-1 py-3">
              <Shirt className="h-4 w-4" />
              <span className="text-xs">Uniformes</span>
              {Object.values(uniformQuantities).some(q => q > 0) && (
                <Badge variant="secondary" className="text-xs">{Object.values(uniformQuantities).filter(q => q > 0).length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="calcados" className="flex flex-col gap-1 py-3">
              <span className="text-lg">👟</span>
              <span className="text-xs">Calçados</span>
              {Object.values(shoeQuantities).some(q => q > 0) && (
                <Badge variant="secondary" className="text-xs">{Object.values(shoeQuantities).filter(q => q > 0).length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="kits" className="flex flex-col gap-1 py-3">
              <Package className="h-4 w-4" />
              <span className="text-xs">Kits Aluno</span>
              {Object.values(kitQuantities).some(q => q > 0) && (
                <Badge variant="secondary" className="text-xs">{Object.values(kitQuantities).filter(q => q > 0).length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="professor" className="flex flex-col gap-1 py-3">
              <Users className="h-4 w-4" />
              <span className="text-xs">Professor</span>
              {(kitPoloQuantity > 0 || Object.values(poloQuantities).some(q => q > 0)) && (
                <Badge variant="secondary" className="text-xs">!</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="mochilas" className="flex flex-col gap-1 py-3">
              <Backpack className="h-4 w-4" />
              <span className="text-xs">Mochilas</span>
              {Object.values(backpackQuantities).some(q => q > 0) && (
                <Badge variant="secondary" className="text-xs">{Object.values(backpackQuantities).filter(q => q > 0).length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Uniformes */}
          <TabsContent value="uniformes" className="mt-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <CardTitle className="flex items-center gap-2">
                    <Shirt className="h-5 w-5" />
                    Uniformes Escolares
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={expandAll}>
                      Expandir Tudo
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={collapseAll}>
                      Recolher Tudo
                    </Button>
                  </div>
                </div>
                <div className="relative mt-2">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por tipo ou tamanho..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(uniformCategories).map(([category, config]) => {
                  const isExpanded = expandedCategories.has(category)
                  const categoryItems = config.genders.flatMap((gender) =>
                    config.sizes.map((size) => ({ gender, size, key: `${category}|${gender}|${size}` }))
                  )
                  const filteredItems = categoryItems.filter(
                    (item) =>
                      !searchTerm ||
                      category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      item.gender.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      item.size.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  const itemsWithQty = filteredItems.filter((item) => uniformQuantities[item.key] > 0).length

                  if (filteredItems.length === 0) return null

                  return (
                    <div key={category} className="rounded-lg border overflow-hidden">
                      <button
                        type="button"
                        onClick={() => toggleCategory(category)}
                        className="flex w-full items-center justify-between bg-muted/50 px-4 py-3 text-left hover:bg-muted/70 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-medium">{category}</span>
                          {itemsWithQty > 0 && (
                            <Badge variant="default">{itemsWithQty} selecionado(s)</Badge>
                          )}
                        </div>
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </button>
                      {isExpanded && (
                        <div className="p-4">
                          {config.genders.map((gender) => (
                            <div key={gender} className="mb-4 last:mb-0">
                              <h4 className="font-medium text-sm text-muted-foreground mb-2">{gender}</h4>
                              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                                {config.sizes.map((size) => {
                                  const key = `${category}|${gender}|${size}`
                                  const qty = uniformQuantities[key] || 0
                                  const matchesSearch = !searchTerm ||
                                    category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    gender.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    size.toLowerCase().includes(searchTerm.toLowerCase())
                                  
                                  if (!matchesSearch) return null

                                  return (
                                    <div
                                      key={key}
                                      className={`flex items-center justify-between rounded-md border p-2 ${qty > 0 ? 'border-primary bg-primary/5' : ''}`}
                                    >
                                      <span className="text-sm font-medium">{size}</span>
                                      <Input
                                        type="number"
                                        min="0"
                                        value={qty || ""}
                                        onChange={(e) => {
                                          const val = parseInt(e.target.value) || 0
                                          setUniformQuantities((prev) => ({ ...prev, [key]: val }))
                                        }}
                                        className="w-16 h-8 text-center text-sm"
                                        placeholder="0"
                                      />
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Calçados */}
          <TabsContent value="calcados" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-xl">👟</span>
                  Calçados (Tênis)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                  {shoeSizes.map((size) => {
                    const qty = shoeQuantities[size] || 0
                    return (
                      <div
                        key={size}
                        className={`flex flex-col items-center rounded-md border p-3 ${qty > 0 ? 'border-primary bg-primary/5' : ''}`}
                      >
                        <span className="text-sm font-medium mb-2">Tam. {size}</span>
                        <Input
                          type="number"
                          min="0"
                          value={qty || ""}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0
                            setShoeQuantities((prev) => ({ ...prev, [size]: val }))
                          }}
                          className="w-16 h-8 text-center text-sm"
                          placeholder="0"
                        />
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Kits de Aluno */}
          <TabsContent value="kits" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Kits de Aluno
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {studentKitTypes.map((kit) => {
                    const qty = kitQuantities[kit] || 0
                    return (
                      <div
                        key={kit}
                        className={`flex items-center justify-between rounded-lg border p-4 ${qty > 0 ? 'border-primary bg-primary/5' : ''}`}
                      >
                        <span className="font-medium">{kit}</span>
                        <Input
                          type="number"
                          min="0"
                          value={qty || ""}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0
                            setKitQuantities((prev) => ({ ...prev, [kit]: val }))
                          }}
                          className="w-20 h-9 text-center"
                          placeholder="0"
                        />
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Kit Professor */}
          <TabsContent value="professor" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Kit de Professor
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className={`flex items-center justify-between rounded-lg border p-4 ${kitPoloQuantity > 0 ? 'border-primary bg-primary/5' : ''}`}>
                  <span className="font-medium">Kit de Professor (Completo)</span>
                  <Input
                    type="number"
                    min="0"
                    value={kitPoloQuantity || ""}
                    onChange={(e) => setKitPoloQuantity(parseInt(e.target.value) || 0)}
                    className="w-20 h-9 text-center"
                    placeholder="0"
                  />
                </div>

                <div>
                  <h4 className="font-medium mb-3">Polos Avulsas (Tamanhos)</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    {teacherPoloSizes.map((size) => {
                      const qty = poloQuantities[size] || 0
                      return (
                        <div
                          key={size}
                          className={`flex items-center justify-between rounded-lg border p-3 ${qty > 0 ? 'border-primary bg-primary/5' : ''}`}
                        >
                          <span className="font-medium">{size}</span>
                          <Input
                            type="number"
                            min="0"
                            value={qty || ""}
                            onChange={(e) => {
                              const val = parseInt(e.target.value) || 0
                              setPoloQuantities((prev) => ({ ...prev, [size]: val }))
                            }}
                            className="w-16 h-8 text-center text-sm"
                            placeholder="0"
                          />
                        </div>
                      )
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Mochilas */}
          <TabsContent value="mochilas" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Backpack className="h-5 w-5" />
                  Mochilas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {backpackTypes.map((type) => {
                    const qty = backpackQuantities[type] || 0
                    return (
                      <div
                        key={type}
                        className={`flex items-center justify-between rounded-lg border p-4 ${qty > 0 ? 'border-primary bg-primary/5' : ''}`}
                      >
                        <span className="font-medium">{type}</span>
                        <Input
                          type="number"
                          min="0"
                          value={qty || ""}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0
                            setBackpackQuantities((prev) => ({ ...prev, [type]: val }))
                          }}
                          className="w-20 h-9 text-center"
                          placeholder="0"
                        />
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-center">
          <Button type="submit" size="lg" className="min-w-[200px]">
            Enviar Solicitação
          </Button>
        </div>
      </form>

      {/* Carrinho Flutuante */}
      <CartButton />

      {/* Modal de Resumo */}
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
                <p><span className="font-medium">Nome:</span> {formData.name}</p>
                <p><span className="font-medium">Matrícula:</span> {formData.matricula}</p>
                <p><span className="font-medium">Instituição:</span> {formData.institution}</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Itens Selecionados ({totalItems})</h3>
              <div className="space-y-2">
                {cartItems.map((item) => (
                  <div key={item.id} className="rounded-lg bg-muted p-3 text-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <Badge variant="outline" className="mr-2">{item.category}</Badge>
                        <span className="font-medium">{item.name}</span>
                        {item.details && <span className="text-muted-foreground"> - {item.details}</span>}
                      </div>
                      <Badge>Qtd: {item.quantity}</Badge>
                    </div>
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

      {/* Modal de Sucesso */}
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
