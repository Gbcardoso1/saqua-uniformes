"use client"

import type React from "react"
import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { CheckCircle, Download, Search, Package, Baby, UtensilsCrossed } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

// Itens de Papelaria organizados por categoria
const stationeryCategories = {
  "Pincéis e Arte": [
    "BOLAS DE ALGODÃO 100G - SACO C/ 30 PCT",
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

// Itens de Cozinha
const kitchenItemsList = [
  "FACA DE MESA INOX UND.",
  "GARFO DE MESA INOX UND.",
  "ASSADEIRA RETANG INOX (30X40) UND.",
  "CAÇAROLA ALUMINIO C/ TAMPA Nº 28",
  "CAÇAROLA ALUMINIO C/ TAMPA Nº 32",
  "CAIXA ORGANIZADORA PRETA - 30 LTS",
  "CAIXA TERMICA 500 LTS",
  "CANECA CALDA PLASTICA 270 ML - UND.",
  "ESPATULA INOX C/ FUNDO VAZADO - UND.",
  "FRIGIDEIRA - Nº 40",
  "FRIGIDEIRA C/ TAMPA Nº30",
  "GARFO GRANDE INOX",
  "GARRAFA TERMICA 1 LTS.",
  "GARRAFA TERMICA 1,8 LTS.",
  "JARRA TRANSPARENTE PLÁSTICA 4 LTS.",
  "LIVRO APRENDENDO A COMER E A COZINHAR.",
  "PEGADOR MULTIUSO EM INOX",
  "ACENDEDOR DE FOGÃO.",
  "BACIA PLASTICA - 30 LTS",
  "BATEDOR DE CLARAS.",
  "COLHER DE MESA INOX UND.",
  "COLHER DE SILICONE INFANTIL.",
  "ESCORREDOR DE ARROZ DE ALUMINIO.",
  "ESCUMADEIRA ( GRANDE )",
  "FACA DE MESA P/ CHURRASCO COLOR PRETO UND.",
  "POTE DE PLASTICO QUADRADO 5 LTS.",
  "POTE PLASTICO C/ TRAVA 1,5 LTS.",
  "POTE PLASTICO C/ TRAVA 2,8 LTS.",
  "POTE PLASTICO C/ TRAVA 3 LTS.",
  "PRATO DE SILICONE INFANTIL C/ VENTOSA UND.",
  "PRATO PLASTICO INFANTIL UND.",
  "ABRIDOR DE LATA UND.",
  "ASSADEIRA RETANG BAIXA INOX (28X40) UND.",
  "BACIA BOWL INOX C/TAMPA - 20 CM UND.",
  "BACIA BOWL INOX C/TAMPA - 23,6 CM UND.",
  "BACIA BOWL INOX C/TAMPA - 29,6 CM UND.",
  "BACIA BOWL INOX C/TAMPA DE VIDRO - 32 CM UND.",
  "BACIA PLASTICA 36CM",
  "BACIA PLASTICA 48CM",
  "CAÇAROLA ALUMINIO C/ TAMPA Nº 20",
  "CAÇAROLA ALUMINIO C/ TAMPA Nº 34",
  "CAÇAROLA ALUMINIO C/ TAMPA Nº 36",
  "CAÇAROLA ALUMINIO C/ TAMPA Nº 40",
  "CAÇAROLA ALUMINIO C/ TAMPA Nº 50",
  "CAIXA ORGANIZADORA 12 LTS.",
  "CAIXA ORGANIZADORA 50 LTS.",
  "CAIXA ORGANIZADORA - PRETA 17 LTS.",
  "CAIXA ORGANIZADORA - PRETA 50 LTS.",
  "CHALEIRA - 7,0 LTS",
  "COLHER DE ARROZ INOX",
  "COLHER DE SILICONE",
  "CONCHA ( MEDIA )",
  "CONCHA Nº 14",
  "DESCASCADOR DE LEGUMES INOX UND.",
  "ESCORREDOR DE PRATOS",
  "ESCUMADEIRA ( MÉDIA)",
  "FACA DE COZINHA INOX Nº 03 UND.",
  "FACA DE COZINHA INOX Nº 07 UND.",
  "FACA DE COZINHA INOX Nº 6 UND.",
  "FACA DE COZINHA INOX Nº 8A",
  "FACA DE COZINHA INOX Nº10 UND.",
  "FACA REFEICAO - CX/C 12 UND.",
  "FUNIL DE PLASTICO 12,5CM.",
  "GARRAFA P/ ÁGUA 2LTS.",
  "LEITEIRA/CANECAO Nº 18",
  "PANELA DE PRESSAO 12 L",
  "PANELA DE PRESSÃO 24L",
  "PANELA DE PRESSÃO EM ALUMINIO 20 LITROS.",
  "PANQUEQUEIRA",
  "PEGADOR DE MACARRAO INOX UND.",
  "PEGADOR DE SALADA INOX UND.",
  "PENEIRA INOX 14CM UND.",
  "PENEIRA INOX 18CM UND.",
  "PENEIRA INOX 20CM UND.",
  "POTE MANTIMENTO AVULSO 2000 ML.",
  "PRATO DE VIDRO UND.",
  "RALADOR INOX 4 FACES.",
  "SALEIRO",
  "SOCADOR DE FEIJAO.",
  "TABUA P/ CORTE XG.",
  "TABUA P/ FRIOS PEQUENA.",
  "ESPREMEDOR DE BATATA - EM AÇO INOXIDÁVEL MEDINDO 27CM TOTAL",
  "FRIGIDEIRA - REVESTIMENTO INTERNO ANTIADERENTE, E EXTERNO EM ALUMÍNIO GROSSO 32 CM.",
  "LIXEIRA PLÁSTICA - COM TAMPA E PEDAL, INJETADO EM PLÁSTICO POLIPROPILENO CAPACIDADE 100L",
  "PANELA - CAÇAROLA ANTIADERENTE TEFLON COM TAMPA 28 CM",
  "PANELA - CAÇAROLA PROFISSIONAL EM ALUMÍNIO COM TAMPA 32 CM"
]

// Itens de Creche
const crecheItemsList = [
  "BANHEIRA PARA BEBE",
  "POMADA PARA ASSADURAS",
  "BEBE CONFORTO ATE 13 KG",
  "LENÇO UMEDECIDO C/ 100 UND",
  "CAPA PARA BEBE CONFORTO 96CMX65CM",
  "COLCHONETE CASAL",
  "EDREDOM 1,80M X 2,40M",
  "LENÇO UMEDECIDO C/ 100 UND",
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
  const [formData, setFormData] = useState({
    name: "",
    matricula: "",
    institution: "",
  })

  // Estado para quantidades de papelaria (chave = nome do item, valor = quantidade)
  const [stationeryQuantities, setStationeryQuantities] = useState<Record<string, string>>({})

  // Estado para quantidades de cozinha
  const [kitchenQuantities, setKitchenQuantities] = useState<Record<string, string>>({})

  // Estado para quantidades de creche
  const [crecheQuantities, setCrecheQuantities] = useState<Record<string, string>>({})

  // Estado para busca
  const [stationerySearch, setStationerySearch] = useState("")
  const [kitchenSearch, setKitchenSearch] = useState("")
  const [crecheSearch, setCrecheSearch] = useState("")

  // Estado para categoria expandida
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({})

  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [pdfDownloaded, setPdfDownloaded] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const updateStationeryQuantity = (item: string, quantity: string) => {
    setStationeryQuantities(prev => ({
      ...prev,
      [item]: quantity
    }))
  }

  const updateKitchenQuantity = (item: string, quantity: string) => {
    setKitchenQuantities(prev => ({
      ...prev,
      [item]: quantity
    }))
  }

  const updateCrecheQuantity = (item: string, quantity: string) => {
    setCrecheQuantities(prev => ({
      ...prev,
      [item]: quantity
    }))
  }

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }))
  }

  const expandAllCategories = () => {
    const allExpanded: Record<string, boolean> = {}
    Object.keys(stationeryCategories).forEach(cat => {
      allExpanded[cat] = true
    })
    setExpandedCategories(allExpanded)
  }

  const collapseAllCategories = () => {
    setExpandedCategories({})
  }

  // Filtrar itens de papelaria por busca
  const filteredStationeryCategories = useMemo(() => {
    if (!stationerySearch.trim()) return stationeryCategories

    const search = stationerySearch.toLowerCase()
    const filtered: Record<string, string[]> = {}

    Object.entries(stationeryCategories).forEach(([category, items]) => {
      const matchedItems = items.filter(item =>
        item.toLowerCase().includes(search)
      )
      if (matchedItems.length > 0) {
        filtered[category] = matchedItems
      }
    })

    return filtered
  }, [stationerySearch])

  // Filtrar itens de cozinha por busca
  const filteredKitchenItems = useMemo(() => {
    if (!kitchenSearch.trim()) return kitchenItemsList
    const search = kitchenSearch.toLowerCase()
    return kitchenItemsList.filter(item => item.toLowerCase().includes(search))
  }, [kitchenSearch])

  // Filtrar itens de creche por busca
  const filteredCrecheItems = useMemo(() => {
    if (!crecheSearch.trim()) return crecheItemsList
    const search = crecheSearch.toLowerCase()
    return crecheItemsList.filter(item => item.toLowerCase().includes(search))
  }, [crecheSearch])

  // Contar itens selecionados
  const selectedStationeryCount = Object.values(stationeryQuantities).filter(q => q && parseInt(q) > 0).length
  const selectedKitchenCount = Object.values(kitchenQuantities).filter(q => q && parseInt(q) > 0).length
  const selectedCrecheCount = Object.values(crecheQuantities).filter(q => q && parseInt(q) > 0).length

  // Obter itens selecionados para exibição
  const getSelectedStationeryItems = () => {
    return Object.entries(stationeryQuantities)
      .filter(([, qty]) => qty && parseInt(qty) > 0)
      .map(([item, quantity]) => ({ item, quantity }))
  }

  const getSelectedKitchenItems = () => {
    return Object.entries(kitchenQuantities)
      .filter(([, qty]) => qty && parseInt(qty) > 0)
      .map(([item, quantity]) => ({ item, quantity }))
  }

  const getSelectedCrecheItems = () => {
    return Object.entries(crecheQuantities)
      .filter(([, qty]) => qty && parseInt(qty) > 0)
      .map(([item, quantity]) => ({ item, quantity }))
  }

  const downloadPDF = async () => {
    const { jsPDF } = await import("jspdf")
    const doc = new jsPDF()

    // Header
    doc.setFontSize(18)
    doc.setFont("helvetica", "bold")
    doc.text("SOLICITACAO DE ALMOXARIFADO", 105, 20, { align: "center" })

    // Horizontal line
    doc.setLineWidth(0.5)
    doc.line(20, 25, 190, 25)

    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    doc.text(`Data: ${new Date().toLocaleDateString("pt-BR")}`, 105, 32, { align: "center" })

    // Personal Info
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("DADOS DO SOLICITANTE", 20, 42)
    doc.setFont("helvetica", "normal")
    doc.setFontSize(11)
    let yPos = 50
    doc.text(`Nome: ${formData.name}`, 20, yPos)
    yPos += 7
    doc.text(`Matricula: ${formData.matricula}`, 20, yPos)
    yPos += 7
    doc.text(`Instituicao: ${formData.institution}`, 20, yPos)
    yPos += 12

    // Stationery Items
    const filledStationery = getSelectedStationeryItems()
    if (filledStationery.length > 0) {
      doc.setFontSize(14)
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
      yPos += 4
    }

    // Kitchen Items
    const filledKitchen = getSelectedKitchenItems()
    if (filledKitchen.length > 0) {
      if (yPos > 250) {
        doc.addPage()
        yPos = 20
      }
      doc.setFontSize(14)
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
      yPos += 4
    }

    // Creche Items
    const filledCreche = getSelectedCrecheItems()
    if (filledCreche.length > 0) {
      if (yPos > 250) {
        doc.addPage()
        yPos = 20
      }
      doc.setFontSize(14)
      doc.setFont("helvetica", "bold")
      doc.text("ITENS DE CRECHE", 20, yPos)
      yPos += 8
      doc.setFont("helvetica", "normal")
      doc.setFontSize(10)
      filledCreche.forEach((c, i) => {
        if (yPos > 270) {
          doc.addPage()
          yPos = 20
        }
        doc.text(`${i + 1}. ${c.item} | Qtd: ${c.quantity}`, 20, yPos)
        yPos += 6
      })
    }

    doc.save(`solicitacao-almoxarifado-${formData.name.replace(/\s+/g, "-")}-${Date.now()}.pdf`)
    setPdfDownloaded(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (selectedStationeryCount === 0 && selectedKitchenCount === 0 && selectedCrecheCount === 0) {
      alert("Por favor, selecione pelo menos um item antes de enviar.")
      return
    }

    setPdfDownloaded(false)
    setShowConfirmModal(true)
  }

  const confirmSubmission = async () => {
    if (!pdfDownloaded) {
      alert("Por favor, baixe o PDF antes de confirmar o envio.")
      return
    }

    setIsSubmitting(true)
    try {
      const submissionData = {
        ...formData,
        submissionType: "almoxarifado",
        stationeryItems: getSelectedStationeryItems(),
        kitchenItems: getSelectedKitchenItems(),
        crecheItems: getSelectedCrecheItems(),
      }

      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      })

      if (!response.ok) {
        throw new Error("Erro ao enviar solicitação")
      }

      setShowConfirmModal(false)
      setShowSuccessModal(true)

      // Reset form
      setFormData({ name: "", matricula: "", institution: "" })
      setStationeryQuantities({})
      setKitchenQuantities({})
      setCrecheQuantities({})
      setPdfDownloaded(false)
    } catch (error) {
      console.error("Error submitting form:", error)
      alert("Erro ao enviar solicitação. Tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const clearStationerySelection = () => {
    setStationeryQuantities({})
  }

  const clearKitchenSelection = () => {
    setKitchenQuantities({})
  }

  const clearCrecheSelection = () => {
    setCrecheQuantities({})
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

      <Tabs defaultValue="papelaria" className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-auto">
          <TabsTrigger value="papelaria" className="flex flex-col gap-1 py-3">
            <Package className="h-4 w-4" />
            <span className="text-xs">Papelaria</span>
            {selectedStationeryCount > 0 && (
              <Badge variant="secondary" className="text-xs">{selectedStationeryCount}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="cozinha" className="flex flex-col gap-1 py-3">
            <UtensilsCrossed className="h-4 w-4" />
            <span className="text-xs">Cozinha</span>
            {selectedKitchenCount > 0 && (
              <Badge variant="secondary" className="text-xs">{selectedKitchenCount}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="creche" className="flex flex-col gap-1 py-3">
            <Baby className="h-4 w-4" />
            <span className="text-xs">Creche</span>
            {selectedCrecheCount > 0 && (
              <Badge variant="secondary" className="text-xs">{selectedCrecheCount}</Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="papelaria">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>Itens de Papelaria</CardTitle>
                  <CardDescription className="mt-1">
                    Preencha apenas a quantidade dos itens que deseja solicitar
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={expandAllCategories}>
                    Expandir Tudo
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={collapseAllCategories}>
                    Recolher Tudo
                  </Button>
                  {selectedStationeryCount > 0 && (
                    <Button type="button" variant="destructive" size="sm" onClick={clearStationerySelection}>
                      Limpar ({selectedStationeryCount})
                    </Button>
                  )}
                </div>
              </div>
              <div className="relative mt-4">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar item de papelaria..."
                  value={stationerySearch}
                  onChange={(e) => setStationerySearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-4">
                  {Object.entries(filteredStationeryCategories).map(([category, items]) => (
                    <div key={category} className="rounded-lg border border-border overflow-hidden">
                      <button
                        type="button"
                        onClick={() => toggleCategory(category)}
                        className="w-full flex items-center justify-between p-3 bg-muted/50 hover:bg-muted transition-colors text-left"
                      >
                        <span className="font-medium">{category}</span>
                        <div className="flex items-center gap-2">
                          {items.some(item => stationeryQuantities[item] && parseInt(stationeryQuantities[item]) > 0) && (
                            <Badge variant="default" className="text-xs">
                              {items.filter(item => stationeryQuantities[item] && parseInt(stationeryQuantities[item]) > 0).length} selecionado(s)
                            </Badge>
                          )}
                          <span className="text-muted-foreground text-sm">
                            {expandedCategories[category] ? "▲" : "▼"}
                          </span>
                        </div>
                      </button>
                      {(expandedCategories[category] || stationerySearch) && (
                        <div className="p-3 space-y-2 bg-background">
                          {items.map((item) => (
                            <div key={item} className="flex items-center gap-3 py-2 border-b border-border/50 last:border-0">
                              <span className="flex-1 text-sm">{item}</span>
                              <Input
                                type="number"
                                min="0"
                                placeholder="Qtd"
                                value={stationeryQuantities[item] || ""}
                                onChange={(e) => updateStationeryQuantity(item, e.target.value)}
                                className="w-20 h-8 text-center"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  {Object.keys(filteredStationeryCategories).length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      Nenhum item encontrado para &quot;{stationerySearch}&quot;
                    </p>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cozinha">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>Itens de Cozinha</CardTitle>
                  <CardDescription className="mt-1">
                    Preencha apenas a quantidade dos itens que deseja solicitar
                  </CardDescription>
                </div>
                {selectedKitchenCount > 0 && (
                  <Button type="button" variant="destructive" size="sm" onClick={clearKitchenSelection}>
                    Limpar ({selectedKitchenCount})
                  </Button>
                )}
              </div>
              <div className="relative mt-4">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar item de cozinha..."
                  value={kitchenSearch}
                  onChange={(e) => setKitchenSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-2">
                  {filteredKitchenItems.map((item) => (
                    <div key={item} className="flex items-center gap-3 py-3 px-4 rounded-lg border border-border bg-muted/30">
                      <span className="flex-1">{item}</span>
                      <Input
                        type="number"
                        min="0"
                        placeholder="Qtd"
                        value={kitchenQuantities[item] || ""}
                        onChange={(e) => updateKitchenQuantity(item, e.target.value)}
                        className="w-20 h-9 text-center"
                      />
                    </div>
                  ))}
                  {filteredKitchenItems.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      Nenhum item encontrado para &quot;{kitchenSearch}&quot;
                    </p>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="creche">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>Itens de Creche</CardTitle>
                  <CardDescription className="mt-1">
                    Preencha apenas a quantidade dos itens que deseja solicitar
                  </CardDescription>
                </div>
                {selectedCrecheCount > 0 && (
                  <Button type="button" variant="destructive" size="sm" onClick={clearCrecheSelection}>
                    Limpar ({selectedCrecheCount})
                  </Button>
                )}
              </div>
              <div className="relative mt-4">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar item de creche..."
                  value={crecheSearch}
                  onChange={(e) => setCrecheSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {filteredCrecheItems.map((item) => (
                  <div key={item} className="flex items-center gap-3 py-3 px-4 rounded-lg border border-border bg-muted/30">
                    <span className="flex-1">{item}</span>
                    <Input
                      type="number"
                      min="0"
                      placeholder="Qtd"
                      value={crecheQuantities[item] || ""}
                      onChange={(e) => updateCrecheQuantity(item, e.target.value)}
                      className="w-20 h-9 text-center"
                    />
                  </div>
                ))}
                {filteredCrecheItems.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    Nenhum item encontrado para &quot;{crecheSearch}&quot;
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Button type="submit" className="w-full" size="lg">
        Enviar Solicitação
      </Button>

      {/* Confirmation Modal */}
      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Confirmar Solicitação</DialogTitle>
            <DialogDescription>
              Revise os dados abaixo. Você deve baixar o PDF antes de confirmar.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="rounded-lg border border-border p-4">
              <h4 className="font-semibold mb-2">Dados do Solicitante</h4>
              <p><strong>Nome:</strong> {formData.name}</p>
              <p><strong>Matrícula:</strong> {formData.matricula}</p>
              <p><strong>Instituição:</strong> {formData.institution}</p>
            </div>

            {getSelectedStationeryItems().length > 0 && (
              <div className="rounded-lg border border-border p-4">
                <h4 className="font-semibold mb-2">Itens de Papelaria ({getSelectedStationeryItems().length})</h4>
                <div className="max-h-40 overflow-y-auto space-y-1">
                  {getSelectedStationeryItems().map((item, idx) => (
                    <p key={idx} className="text-sm">{item.item} - Qtd: {item.quantity}</p>
                  ))}
                </div>
              </div>
            )}

            {getSelectedKitchenItems().length > 0 && (
              <div className="rounded-lg border border-border p-4">
                <h4 className="font-semibold mb-2">Itens de Cozinha ({getSelectedKitchenItems().length})</h4>
                <div className="max-h-40 overflow-y-auto space-y-1">
                  {getSelectedKitchenItems().map((item, idx) => (
                    <p key={idx} className="text-sm">{item.item} - Qtd: {item.quantity}</p>
                  ))}
                </div>
              </div>
            )}

            {getSelectedCrecheItems().length > 0 && (
              <div className="rounded-lg border border-border p-4">
                <h4 className="font-semibold mb-2">Itens de Creche ({getSelectedCrecheItems().length})</h4>
                <div className="max-h-40 overflow-y-auto space-y-1">
                  {getSelectedCrecheItems().map((item, idx) => (
                    <p key={idx} className="text-sm">{item.item} - Qtd: {item.quantity}</p>
                  ))}
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              onClick={downloadPDF}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              {pdfDownloaded ? "PDF Baixado" : "Baixar PDF"}
              {pdfDownloaded && <CheckCircle className="h-4 w-4 text-green-500" />}
            </Button>
            <Button
              type="button"
              onClick={confirmSubmission}
              disabled={!pdfDownloaded || isSubmitting}
            >
              {isSubmitting ? "Enviando..." : "Confirmar Envio"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-6 w-6" />
              Solicitação Enviada!
            </DialogTitle>
            <DialogDescription>
              Sua solicitação de almoxarifado foi registrada com sucesso.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setShowSuccessModal(false)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </form>
  )
}
