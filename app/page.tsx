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
import { Lock, Shirt, Package, ArrowRight, ClipboardList, ShieldCheck } from "lucide-react"
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

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/70 bg-card/90 backdrop-blur-md">
        <div className="mx-auto flex h-[76px] max-w-6xl items-center justify-between px-4 sm:px-6">
          <Image src="/prefeitura.png" alt="Prefeitura de Saquarema" width={200} height={60} className="h-11 w-auto" priority />
          <Button onClick={() => setShowLoginModal(true)} variant="outline" size="sm" className="gap-2 rounded-full px-4">
            <Lock data-icon="inline-start" /> Gestão
          </Button>
        </div>
      </header>

      <main>
        <section className="border-b border-border/60 bg-muted/35">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.15fr_.85fr] lg:items-center lg:py-16">
            <div className="animate-fade-up">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                <ShieldCheck className="size-4" /> Secretaria de Educação
              </div>
              <h1 className="max-w-2xl text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                Central de solicitações
              </h1>
              <p className="mt-4 max-w-xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
                Um jeito simples e organizado de solicitar materiais para sua unidade escolar.
              </p>
              <div className="mt-7 flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-2"><ClipboardList className="size-4 text-accent-foreground" /> Preenchimento online</span>
                <span className="inline-flex items-center gap-2"><ShieldCheck className="size-4 text-accent-foreground" /> Acompanhamento seguro</span>
              </div>
            </div>
            <div className="rounded-2xl border border-primary/15 bg-primary p-6 text-primary-foreground shadow-lg shadow-primary/10 sm:p-8">
              <p className="text-sm font-medium text-primary-foreground/75">Comece por aqui</p>
              <h2 className="mt-2 text-2xl font-semibold text-balance">Escolha o tipo de solicitação</h2>
              <p className="mt-3 text-sm leading-6 text-primary-foreground/75">Selecione uma das opções abaixo para abrir o formulário correspondente.</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <button onClick={() => { setActiveTab("uniformes"); document.getElementById("formulario")?.scrollIntoView({ behavior: "smooth" }) }} className="group flex items-center justify-between rounded-xl bg-card p-4 text-left text-card-foreground transition-transform hover:-translate-y-0.5">
                  <span><Shirt className="mb-3 size-5 text-primary" /><span className="block font-semibold">Uniformes</span><span className="mt-1 block text-xs text-muted-foreground">Uniformes e calçados</span></span><ArrowRight className="size-4 text-primary transition-transform group-hover:translate-x-1" />
                </button>
                <button onClick={() => { setActiveTab("almoxarifado"); document.getElementById("formulario")?.scrollIntoView({ behavior: "smooth" }) }} className="group flex items-center justify-between rounded-xl bg-card p-4 text-left text-card-foreground transition-transform hover:-translate-y-0.5">
                  <span><Package className="mb-3 size-5 text-accent-foreground" /><span className="block font-semibold">Almoxarifado</span><span className="mt-1 block text-xs text-muted-foreground">Materiais diversos</span></span><ArrowRight className="size-4 text-primary transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </div>
        </section>

        <section id="formulario" className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
          <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div><p className="text-sm font-semibold text-primary">Formulário de solicitação</p><h2 className="mt-1 text-2xl font-semibold tracking-tight">{activeTab === "uniformes" ? "Uniformes e calçados" : "Materiais de almoxarifado"}</h2><p className="mt-2 text-sm text-muted-foreground">Preencha os dados abaixo para enviar sua solicitação.</p></div>
            <div className="flex rounded-xl border border-border bg-muted/50 p-1" role="tablist" aria-label="Tipo de solicitação">
              <Button onClick={() => setActiveTab("uniformes")} variant={activeTab === "uniformes" ? "default" : "ghost"} size="sm" className="gap-2 rounded-lg"><Shirt data-icon="inline-start" /> Uniformes</Button>
              <Button onClick={() => setActiveTab("almoxarifado")} variant={activeTab === "almoxarifado" ? "default" : "ghost"} size="sm" className="gap-2 rounded-lg"><Package data-icon="inline-start" /> Almoxarifado</Button>
            </div>
          </div>
          {activeTab === "uniformes" ? <UniformRequestForm /> : <AlmoxarifadoRequestForm />}
        </section>
      </main>

      <FeedbackButton />
      <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}><DialogContent className="sm:max-w-md"><DialogHeader><div className="mx-auto mb-3 rounded-full bg-primary/10 p-3"><Lock className="size-6 text-primary" /></div><DialogTitle className="text-center">Acesso administrativo</DialogTitle><DialogDescription className="text-center">Digite suas credenciais para acessar os formulários enviados.</DialogDescription></DialogHeader><form onSubmit={handleLogin} className="flex flex-col gap-4"><div className="flex flex-col gap-2"><Label htmlFor="username">Login</Label><Input id="username" placeholder="Digite o login" value={username} onChange={(e) => setUsername(e.target.value)} required /></div><div className="flex flex-col gap-2"><Label htmlFor="password">Senha</Label><Input id="password" type="password" placeholder="Digite a senha" value={password} onChange={(e) => setPassword(e.target.value)} required /></div><div className="flex gap-2"><Button type="button" variant="outline" className="flex-1" onClick={() => { setShowLoginModal(false); setUsername(""); setPassword("") }}>Cancelar</Button><Button type="submit" className="flex-1">Acessar</Button></div></form></DialogContent></Dialog>
    </div>
  )
}
