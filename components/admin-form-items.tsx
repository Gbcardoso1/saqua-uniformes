"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pencil, Plus, Trash2, ArrowUp, ArrowDown, Save } from "lucide-react"

type Item = { id: string; form_type: string; group_name: string; label: string; sort_order: number }
const catalogs = [{ value: "almoxarifado", label: "Almoxarifado" }, { value: "uniformes", label: "Uniformes e Kits" }]

export default function AdminFormItems() {
  const [items, setItems] = useState<Item[]>([])
  const [catalog, setCatalog] = useState("almoxarifado")
  const [group, setGroup] = useState("Geral")
  const [newLabel, setNewLabel] = useState("")
  const [editing, setEditing] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const load = async () => { const r = await fetch("/api/form-items"); const d = await r.json(); setItems(d.items ?? []) }
  useEffect(() => { load() }, [])
  const visible = items.filter((item) => item.form_type === catalog)
  const save = async (body: object, method = "POST") => { setBusy(true); try { await fetch("/api/form-items", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }); await load() } finally { setBusy(false) } }
  const add = async () => { if (!newLabel.trim()) return; await save({ form_type: catalog, group_name: group, label: newLabel, sort_order: visible.length }); setNewLabel("") }
  const move = async (item: Item, direction: number) => { const next = visible[visible.indexOf(item) + direction]; if (!next) return; await save({ id: item.id, label: item.label, group_name: item.group_name, sort_order: next.sort_order }, "PATCH"); await save({ id: next.id, label: next.label, group_name: next.group_name, sort_order: item.sort_order }, "PATCH") }
  return <Card><CardHeader><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><CardTitle>Edições dos formulários</CardTitle><Select value={catalog} onValueChange={setCatalog}><SelectTrigger className="w-full sm:w-52"><SelectValue /></SelectTrigger><SelectContent>{catalogs.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent></Select></div></CardHeader><CardContent className="flex flex-col gap-4"><div className="grid gap-2 sm:grid-cols-[1fr_180px_auto]"><Input value={newLabel} onChange={(e) => setNewLabel(e.target.value)} placeholder="Nome do novo item" onKeyDown={(e) => { if (e.key === "Enter") add() }} /><Input value={group} onChange={(e) => setGroup(e.target.value)} placeholder="Grupo / categoria" /><Button onClick={add} disabled={busy}><Plus data-icon="inline-start" />Adicionar</Button></div><div className="flex flex-col gap-2">{visible.map((item, index) => <div key={item.id} className="flex items-center gap-2 rounded-lg border border-border p-2"><div className="flex flex-1 items-center gap-2">{editing === item.id ? <Input autoFocus defaultValue={item.label} onKeyDown={async (e) => { if (e.key === "Enter") { await save({ id: item.id, label: e.currentTarget.value, group_name: item.group_name, sort_order: item.sort_order }, "PATCH"); setEditing(null) } }} /> : <span className="text-sm">{item.label}</span>}</div><Button size="icon" variant="ghost" onClick={() => setEditing(editing === item.id ? null : item.id)} aria-label="Editar item">{editing === item.id ? <Save /> : <Pencil />}</Button><Button size="icon" variant="ghost" disabled={index === 0 || busy} onClick={() => move(item, -1)} aria-label="Mover para cima"><ArrowUp /></Button><Button size="icon" variant="ghost" disabled={index === visible.length - 1 || busy} onClick={() => move(item, 1)} aria-label="Mover para baixo"><ArrowDown /></Button><Button size="icon" variant="ghost" onClick={async () => { if (confirm("Remover este item?")) await fetch(`/api/form-items?id=${item.id}`, { method: "DELETE" }).then(load) }} aria-label="Remover item"><Trash2 /></Button></div>)}{visible.length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">Nenhum item cadastrado. Adicione o primeiro acima.</p>}</div></CardContent></Card>
}
