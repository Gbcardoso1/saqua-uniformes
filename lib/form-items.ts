import type { Dispatch, SetStateAction } from "react"
export type FormItem = { id: string; form_type: string; group_name: string; label: string; sort_order: number }
export async function fetchFormItems() { const response = await fetch("/api/form-items", { cache: "no-store" }); if (!response.ok) throw new Error("Falha ao carregar itens"); const data = await response.json(); return data.items as FormItem[] }
export function groupItems(items: FormItem[], group: string) { return items.filter((item) => item.group_name === group).sort((a, b) => a.sort_order - b.sort_order).map((item) => item.label) }
export type ItemsSetter<T> = Dispatch<SetStateAction<T>>
