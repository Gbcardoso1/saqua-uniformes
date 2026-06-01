"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { MessageSquarePlus, Send, CheckCircle, Lightbulb, AlertTriangle, Heart, HelpCircle } from "lucide-react"

const categories = [
  { value: "sugestao", label: "Sugestao", icon: Lightbulb, color: "bg-amber-500", bgLight: "bg-amber-50 border-amber-200 hover:border-amber-400", textColor: "text-amber-700" },
  { value: "problema", label: "Problema", icon: AlertTriangle, color: "bg-red-500", bgLight: "bg-red-50 border-red-200 hover:border-red-400", textColor: "text-red-700" },
  { value: "elogio", label: "Elogio", icon: Heart, color: "bg-pink-500", bgLight: "bg-pink-50 border-pink-200 hover:border-pink-400", textColor: "text-pink-700" },
  { value: "duvida", label: "Duvida", icon: HelpCircle, color: "bg-blue-500", bgLight: "bg-blue-50 border-blue-200 hover:border-blue-400", textColor: "text-blue-700" },
]

export function FeedbackButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [formData, setFormData] = useState({
    institution: "",
    category: "sugestao",
    message: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.institution.trim() || !formData.message.trim()) {
      alert("Por favor, preencha todos os campos.")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/feedbacks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Erro ao enviar feedback")
      }

      setIsSuccess(true)
      setFormData({ institution: "", category: "sugestao", message: "" })
      
      setTimeout(() => {
        setIsSuccess(false)
        setIsOpen(false)
      }, 2500)
    } catch (error) {
      console.error("Erro ao enviar feedback:", error)
      alert("Erro ao enviar feedback. Tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedCategory = categories.find(c => c.value === formData.category)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          size="icon"
          className="fixed right-4 bottom-24 z-40 h-14 w-14 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:scale-105"
          title="Enviar feedback ou sugestao"
        >
          <MessageSquarePlus className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md p-0 border-l-0">
        <div className="h-full flex flex-col">
          {/* Header com gradiente */}
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 px-6 py-8 text-white">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <MessageSquarePlus className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-bold">Feedback</h2>
            </div>
            <p className="text-emerald-100 text-sm">
              Sua opiniao nos ajuda a melhorar! Compartilhe suas ideias.
            </p>
          </div>

          {isSuccess ? (
            <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-400/20 rounded-full animate-ping" />
                <div className="relative rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 p-5">
                  <CheckCircle className="h-10 w-10 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mt-6">Obrigado!</h3>
              <p className="text-gray-500 mt-2 max-w-[240px]">
                Seu feedback foi enviado com sucesso. Agradecemos sua contribuicao!
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col p-6 gap-5 overflow-y-auto">
              {/* Nome da Instituicao */}
              <div className="space-y-2">
                <Label htmlFor="institution" className="text-sm font-medium text-gray-700">
                  Instituicao
                </Label>
                <Input
                  id="institution"
                  placeholder="Ex: EMEF Joao da Silva"
                  value={formData.institution}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  className="h-11 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                  required
                />
              </div>

              {/* Tipo de Feedback - Cards selecionaveis */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Tipo de feedback
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((category) => {
                    const Icon = category.icon
                    const isSelected = formData.category === category.value
                    return (
                      <button
                        key={category.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, category: category.value })}
                        className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all duration-200 ${
                          isSelected 
                            ? `${category.bgLight} border-current ${category.textColor} shadow-sm` 
                            : "bg-gray-50 border-gray-100 text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        <div className={`p-1.5 rounded-lg ${isSelected ? category.color : "bg-gray-200"}`}>
                          <Icon className={`h-4 w-4 ${isSelected ? "text-white" : "text-gray-500"}`} />
                        </div>
                        <span className="text-sm font-medium">{category.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Mensagem */}
              <div className="space-y-2 flex-1">
                <Label htmlFor="message" className="text-sm font-medium text-gray-700">
                  Mensagem
                </Label>
                <Textarea
                  id="message"
                  placeholder="Descreva sua sugestao, problema ou feedback..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="min-h-[120px] resize-none border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                  required
                />
              </div>

              {/* Botao de envio */}
              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium rounded-xl shadow-lg shadow-emerald-500/20 transition-all duration-300 hover:shadow-emerald-500/30"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Enviando...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send className="h-5 w-5" />
                    Enviar Feedback
                  </span>
                )}
              </Button>
            </form>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
