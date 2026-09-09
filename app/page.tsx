"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import UniformRequestForm from "@/components/uniform-request-form"
import AlmoxarifadoRequestForm from "@/components/almoxarifado-request-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Lock, Shirt, Package } from "lucide-react"
import Image from "next/image"
import { FeedbackButton } from "@/components/feedback-button"
import { BeachDecorations } from "@/components/beach-decorations"

export default function Home() {
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [activeTab, setActiveTab] = useState<"uniformes" | "almoxarifado">("uniformes")
  const router = useRouter()

  const ADMIN_USERNAME = "patrimônio"
  const ADMIN_PASSWORD = "#cmpp123"

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // Store authentication in sessionStorage
      sessionStorage.setItem("adminAuth", "true")
      router.push("/admin")
    } else {
      alert("Login ou senha incorretos!")
      setUsername("")
      setPassword("")
    }
  }

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/15 bg-[#116f73]/85 shadow-lg shadow-[#073f45]/10 backdrop-blur-xl supports-[backdrop-filter]:bg-[#116f73]/80">
        <div className="container flex h-16 items-center justify-between px-4 gap-4">
          <Image
            src="/prefeitura.png"
            alt="Prefeitura Sabuarena"
            width={200}
            height={60}
            className="h-12 w-auto"
            priority
          />
          <Button
            onClick={() => setShowLoginModal(true)}
            variant="outline"
            size="sm"
            className="gap-2 text-xs ml-auto bg-white/10 hover:bg-white/20 border-white/30 text-white"
          >
            <Lock className="h-3 w-3" />
            Gestão
          </Button>
        </div>
      </header>

      <main className="relative min-h-screen overflow-hidden bg-[#0d6971] px-4 pb-12 pt-28 selection:bg-[#f7c75b]/30">
        <BeachDecorations />
        <div className="relative z-10 mx-auto max-w-4xl">
          <div className="animate-rise-in mb-10 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-white/80 shadow-sm backdrop-blur-sm">
              <span className="size-1.5 rounded-full bg-[#f7c75b]" />
              PREFEITURA DE SAQUAREMA
            </div>
            <h1 className="mx-auto mb-3 max-w-3xl text-3xl font-bold tracking-tight text-white text-balance md:text-5xl">
              {activeTab === "uniformes"
                ? "Formulário de Solicitação de Uniformes e Calçados"
                : "Formulário de Solicitação de Almoxarifado"}
            </h1>
            <p className="mx-auto mb-7 max-w-2xl text-base leading-7 text-white/80 text-pretty md:text-lg">
              {activeTab === "uniformes"
                ? "Preencha os dados abaixo para solicitar uniformes e calçados para sua instituição"
                : "Preencha os dados abaixo para solicitar itens de papelaria e cozinha para sua instituição"}
            </p>

            {/* Tab Navigation */}
            <div className="animate-float-in flex flex-wrap justify-center gap-2 mb-8" style={{ animationDelay: "120ms" }}>
              <Button
                onClick={() => setActiveTab("uniformes")}
                variant={activeTab === "uniformes" ? "default" : "outline"}
                className={`gap-2 ${
                  activeTab === "uniformes"
                    ? "bg-transparent !border-2 !border-selection text-selection hover:bg-white/10"
                    : "bg-transparent border-white/30 text-white hover:bg-white/10"
                }`}
              >
                <Shirt className="h-4 w-4" />
                Uniformes e Calçados
              </Button>
              <Button
                onClick={() => setActiveTab("almoxarifado")}
                variant={activeTab === "almoxarifado" ? "default" : "outline"}
                className={`gap-2 ${
                  activeTab === "almoxarifado"
                    ? "bg-transparent !border-2 !border-selection text-selection hover:bg-white/10"
                    : "bg-transparent border-white/30 text-white hover:bg-white/10"
                }`}
              >
                <Package className="h-4 w-4" />
                Almoxarifado
              </Button>
              <FeedbackButton />
            </div>
          </div>
          
          <div className="animate-float-in" style={{ animationDelay: "220ms" }}>
            {activeTab === "uniformes" ? <UniformRequestForm /> : <AlmoxarifadoRequestForm />}
          </div>
        </div>

      </main>

      <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Lock className="h-8 w-8 text-primary" />
              </div>
            </div>
            <DialogTitle className="text-center">Acesso Administrativo</DialogTitle>
            <DialogDescription className="text-center">
              Digite suas credenciais para acessar os formulários enviados
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Login</Label>
              <Input
                id="username"
                type="text"
                placeholder="Digite o login"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Digite a senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={() => {
                  setShowLoginModal(false)
                  setUsername("")
                  setPassword("")
                }}
              >
                Cancelar
              </Button>
              <Button type="submit" className="flex-1">
                Acessar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
