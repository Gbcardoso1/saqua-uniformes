"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MessageSquarePlus, Send, CheckCircle } from "lucide-react"

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
      }, 2000)
    } catch (error) {
      console.error("Erro ao enviar feedback:", error)
      alert("Erro ao enviar feedback. Tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          size="icon"
          className="fixed right-4 bottom-24 z-40 h-12 w-12 rounded-full bg-emerald-600 hover:bg-emerald-700 shadow-lg"
          title="Enviar feedback ou sugestão"
        >
          <MessageSquarePlus className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <MessageSquarePlus className="h-5 w-5 text-emerald-600" />
            Feedback e Sugestões
          </SheetTitle>
          <SheetDescription>
            Sua opinião é importante! Envie sugestões para melhorar nosso sistema.
          </SheetDescription>
        </SheetHeader>

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-emerald-100 p-4 mb-4">
              <CheckCircle className="h-12 w-12 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-emerald-700">Feedback Enviado!</h3>
            <p className="text-muted-foreground mt-2">
              Agradecemos sua contribuição para melhorar nosso sistema.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="institution">Nome da Instituição *</Label>
              <Input
                id="institution"
                placeholder="Ex: EMEF João da Silva"
                value={formData.institution}
                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Tipo de Feedback</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sugestao">Sugestão de Melhoria</SelectItem>
                  <SelectItem value="problema">Relatar Problema</SelectItem>
                  <SelectItem value="elogio">Elogio</SelectItem>
                  <SelectItem value="duvida">Dúvida</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Mensagem *</Label>
              <Textarea
                id="message"
                placeholder="Descreva sua sugestão, problema ou feedback..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={5}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                "Enviando..."
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Enviar Feedback
                </>
              )}
            </Button>
          </form>
        )}
      </SheetContent>
    </Sheet>
  )
}
