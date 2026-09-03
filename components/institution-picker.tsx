"use client"

import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { institutions } from "@/lib/institutions"

type InstitutionPickerProps = {
  value: string
  onChange: (value: string) => void
  required?: boolean
  includeAll?: boolean
}

export function InstitutionPicker({ value, onChange, required, includeAll = false }: InstitutionPickerProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <input type="text" name="institution" value={value} onChange={() => undefined} required={required} tabIndex={-1} className="sr-only" aria-hidden="true" />
      <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
        >
          <span className={cn("truncate", !value && "text-muted-foreground")}>
            {value === "all" ? "Todas as instituições" : value || "Selecione a instituição"}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <Command>
          <CommandInput placeholder="Buscar instituição..." />
          <CommandList>
            <CommandEmpty>Nenhuma instituição encontrada.</CommandEmpty>
            {includeAll && (
              <CommandItem value="all" onSelect={() => {
                onChange("all")
                setOpen(false)
              }}>
                <Check className={cn("mr-2 h-4 w-4", value === "all" ? "opacity-100" : "opacity-0")} />
                <span>Todas as instituições</span>
              </CommandItem>
            )}
            {institutions.map((institution) => (
              <CommandItem key={institution} value={institution} onSelect={() => {
                  onChange(institution)
                  setOpen(false)
                }}>
                <Check className={cn("mr-2 h-4 w-4", value === institution ? "opacity-100" : "opacity-0")} />
                <span className="truncate">{institution}</span>
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
      </Popover>
    </>
  )
}
