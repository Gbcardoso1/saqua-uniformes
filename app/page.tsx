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
import { ArrowUpRight, ClipboardList, Lock, Package, Shirt } from "lucide-react"
import Image from "next/image"
import { FeedbackButton } from "@/components/feedback-button"

export default function Home() {
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [activeTab, setActiveTab] = useState<"uniformes" | "almoxarifado">("uniformes")
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (username === "patrimônio" && password === "#cmpp123") {
      sessionStorage.setItem("adminAuth", "true")
      router.push("/admin")
    } else {
      alert("Login ou senha incorretos!")
      setUsername("")
      setPassword("")
    }
  }

  const selectService = (service: "uniformes" | "almoxarifado") => {
    setActiveTab(service)
    document.getElementById("formulario")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/70 bg-card">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Image src="/prefeitura.png" alt="Prefeitura de Saquarema" width={200} height={60} className="h-12 w-auto" priority />
          <Button onClick={() => setShowLoginModal(true)} variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
            <Lock data-icon="inline-start" /> Área de gestão
          </Button>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-7xl px-5 pb-12 pt-14 sm:px-8 sm:pb-16 sm:pt-20">
          <div className="max-w-3xl">
            <p className="mb-5 flex items-center gap-2 text-sm font-semibold tracking-wide text-primary"><span className="size-2 rounded-full bg-accent" /> Secretaria de Educação</p>
            <h1 className="text-balance text-4xl font-semibold tracking-[-0.04em] text-foreground sm:text-6xl">Central de solicitações</h1>
            <p className="mt-5 max-w-2xl text-pretty text-lg leading-8 text-muted-foreground">Solicite materiais, uniformes e calçados para sua unidade escolar de forma simples, organizada e segura.</p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-2">
            <button onClick={() => selectService("uniformes")} className="group flex min-h-48 flex-col justify-between rounded-2xl border border-border bg-card p-6 text-left shadow-sm transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg">
              <div className="flex items-start justify-between"><span className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Shirt className="size-5" /></span><ArrowUpRight className="size-5 text-muted-foreground transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" /></div>
              <div><h2 className="text-xl font-semibold">Uniformes e calçados</h2><p className="mt-1 text-sm leading-6 text-muted-foreground">Solicite peças para alunos e profissionais da rede.</p></div>
            </button>
            <button onClick={() => selectService("almoxarifado")} className="group flex min-h-48 flex-col justify-between rounded-2xl border border-border bg-card p-6 text-left shadow-sm transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg">
              <div className="flex items-start justify-between"><span className="flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground"><Package className="size-5" /></span><ArrowUpRight className="size-5 text-muted-foreground transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" /></div>
              <div><h2 className="text-xl font-semibold">Materiais de almoxarifado</h2><p className="mt-1 text-sm leading-6 text-muted-foreground">Encontre itens de papelaria, cozinha e creche.</p></div>
            </button>
          </div>
        </section>

        <section id="formulario" className="border-t border-border/70 bg-muted/30 px-5 py-12 sm:px-8 sm:py-16">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div><p className="flex items-center gap-2 text-sm font-semibold text-primary"><ClipboardList className="size-4" /> Formulário de solicitação</p><h2 className="mt-2 text-2xl font-semibold tracking-tight">{activeTab === "uniformes" ? "Uniformes e calçados" : "Materiais de almoxarifado"}</h2></div><div className="flex w-fit rounded-xl border border-border bg-card p-1" role="tablist" aria-label="Tipo de solicitação"><Button onClick={() => setActiveTab("uniformes")} variant={activeTab === "uniformes" ? "default" : "ghost"} size="sm" className="gap-2 rounded-lg"><Shirt data-icon="inline-start" /> Uniformes</Button><Button onClick={() => setActiveTab("almoxarifado")} variant={activeTab === "almoxarifado" ? "default" : "ghost"} size="sm" className="gap-2 rounded-lg"><Package data-icon="inline-start" /> Almoxarifado</Button></div></div>
            {activeTab === "uniformes" ? <UniformRequestForm /> : <AlmoxarifadoRequestForm />}
          </div>
        </section>
      </main>

      <FeedbackButton />
      <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}><DialogContent className="sm:max-w-md"><DialogHeader><DialogTitle>Acesso administrativo</DialogTitle><DialogDescription>Digite suas credenciais para acessar os formulários enviados.</DialogDescription></DialogHeader><form onSubmit={handleLogin} className="flex flex-col gap-4"><div className="flex flex-col gap-2"><Label htmlFor="username">Login</Label><Input id="username" placeholder="Digite o login" value={username} onChange={(e) => setUsername(e.target.value)} required /></div><div className="flex flex-col gap-2"><Label htmlFor="password">Senha</Label><Input id="password" type="password" placeholder="Digite a senha" value={password} onChange={(e) => setPassword(e.target.value)} required /></div><div className="flex gap-2"><Button type="button" variant="outline" className="flex-1" onClick={() => { setShowLoginModal(false); setUsername(""); setPassword("") }}>Cancelar</Button><Button type="submit" className="flex-1">Acessar</Button></div></form></DialogContent></Dialog>
    </div>
  )
}
