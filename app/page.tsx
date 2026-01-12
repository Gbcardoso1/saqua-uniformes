"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import UniformRequestForm from "@/components/uniform-request-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Lock } from "lucide-react"
import Image from "next/image"

export default function Home() {
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
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
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#1a8b8b]/95 backdrop-blur supports-[backdrop-filter]:bg-[#1a8b8b]/90 border-b border-white/20">
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

      <main className="min-h-screen bg-[#1a8b8b] pt-24 pb-8 px-4">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-white mb-2 text-balance">
              Formulário de Solicitação de Uniformes e Calçados
            </h1>
            <p className="text-white/90 text-pretty">
              Preencha os dados abaixo para solicitar uniformes e calçados para sua instituição
            </p>
          </div>
          <UniformRequestForm />
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
