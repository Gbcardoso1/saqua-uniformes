"use client"

import { useEffect, useMemo, useState } from "react"
import { ArrowDown, ArrowUp, Pencil, Plus, Save, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

type Item = { id: string; form_type: string; group_name: string; label: string; sort_order: number }
const catalogs = [
  { value: "almoxarifado", label: "Almoxarifado" },
  { value: "uniformes", label: "Uniformes e Kits" },
]

export default function AdminFormItems() {
  const [items, setItems] = useState<Item[]>([])
  const [catalog, setCatalog] = useState("almoxarifado")
  const categoryMap: Record<string, string[]> = { almoxarifado: ["itens papelaria", "itens cozinha", "itens creche"], uniformes: ["uniformes", "calçados", "kits de aluno", "professor", "mochilas"] }
  const [group, setGroup] = useState(categoryMap.almoxarifado[0])
  const [groupFilter, setGroupFilter] = useState(categoryMap.almoxarifado[0])
  const [newLabel, setNewLabel] = useState("")
  const [editing, setEditing] = useState<string | null>(null)
  const [editValue, setEditValue] = useState("")
  const [busy, setBusy] = useState(false)

  const load = async () => {
    const response = await fetch("/api/form-items", { cache: "no-store" })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || "Falha ao carregar itens")
    setItems(data.items ?? [])
  }
  useEffect(() => { load().catch((error) => toast.error(error.message)) }, [])

  const groups = categoryMap[catalog] ?? []
  const visible = useMemo(() => items.filter((item) => item.form_type === catalog && (groupFilter === "todos" || item.group_name === groupFilter)).sort((a, b) => a.group_name.localeCompare(b.group_name) || a.sort_order - b.sort_order), [items, catalog, groupFilter])
  const request = async (body: object, method = "POST") => {
    setBusy(true)
    try {
      const response = await fetch("/api/form-items", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Não foi possível salvar")
      await load()
      toast.success("Catálogo atualizado")
    } finally { setBusy(false) }
  }
  const add = async () => {
    const label = newLabel.trim()
    if (!label) return
    await request({ form_type: catalog, group_name: group.trim() || "Geral", label, sort_order: visible.length })
    setNewLabel("")
  }
  const update = async (item: Item, label = editValue) => {
    await request({ id: item.id, label, group_name: item.group_name, sort_order: item.sort_order }, "PATCH")
    setEditing(null)
  }
  const move = async (item: Item, direction: number) => {
    const other = visible[visible.indexOf(item) + direction]
    if (!other) return
    await request({ id: item.id, label: item.label, group_name: item.group_name, sort_order: other.sort_order }, "PATCH")
    await request({ id: other.id, label: other.label, group_name: other.group_name, sort_order: item.sort_order }, "PATCH")
  }
  const remove = async (item: Item) => { if (window.confirm(`Remover “${item.label}” dos novos pedidos?`)) await request({ id: item.id, label: item.label, group_name: item.group_name, sort_order: item.sort_order, is_active: false }, "PATCH") }

  return <Card>
    <CardHeader><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><CardTitle>Edições dos formulários</CardTitle><Select value={catalog} onValueChange={(value) => { setCatalog(value); setGroupFilter(categoryMap[value][0]); setGroup(categoryMap[value][0]) }}><SelectTrigger className="w-full sm:w-56"><SelectValue /></SelectTrigger><SelectContent>{catalogs.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}</SelectContent></Select></div></CardHeader>
    <CardContent className="flex flex-col gap-4"><div className="flex flex-wrap gap-2" role="tablist" aria-label="Categorias do formulário">{groups.map((itemGroup) => <Button key={itemGroup} type="button" variant={groupFilter === itemGroup ? "default" : "outline"} onClick={() => { setGroupFilter(itemGroup); setGroup(itemGroup) }}>{itemGroup}</Button>)}</div><div className="grid gap-2 sm:grid-cols-[1fr_180px_auto]"><Input value={newLabel} onChange={(event) => setNewLabel(event.target.value)} placeholder="Nome do novo item" onKeyDown={(event) => { if (event.key === "Enter" && !event.nativeEvent.isComposing && event.keyCode !== 229) add() }} /><Input value={group} onChange={(event) => setGroup(event.target.value)} placeholder="Grupo / categoria" /><Button onClick={add} disabled={busy}><Plus data-icon="inline-start" />Adicionar</Button></div>
      {visible.length === 0 ? <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">Nenhum item cadastrado. Adicione o primeiro item acima.</p> : <div className="flex flex-col gap-2">{visible.map((item, index) => <div key={item.id} className="flex items-center gap-2 rounded-lg border p-2"><div className="min-w-0 flex-1">{editing === item.id ? <Input value={editValue} autoFocus onChange={(event) => setEditValue(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.nativeEvent.isComposing && event.keyCode !== 229) update(item) }} /> : <><p className="truncate text-sm">{item.label}</p><p className="text-xs text-muted-foreground">{item.group_name}</p></>}</div><Button size="icon" variant="ghost" onClick={() => { setEditing(editing === item.id ? null : item.id); setEditValue(item.label) }} aria-label="Editar item">{editing === item.id ? <Save /> : <Pencil />}</Button><Button size="icon" variant="ghost" disabled={index === 0 || busy} onClick={() => move(item, -1)} aria-label="Mover para cima"><ArrowUp /></Button><Button size="icon" variant="ghost" disabled={index === visible.length - 1 || busy} onClick={() => move(item, 1)} aria-label="Mover para baixo"><ArrowDown /></Button><Button size="icon" variant="ghost" onClick={() => remove(item)} aria-label="Remover item"><Trash2 /></Button></div>)}</div>}
    </CardContent>
  </Card>
}
