"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ShoppingCart, Trash2, Package, Shirt, BookOpen } from "lucide-react"

export type CartItem = {
  id: string
  category: string
  name: string
  details?: string
  quantity: number
}

type RequestCartProps = {
  items: CartItem[]
  onRemoveItem: (id: string) => void
  onClearCart: () => void
  title?: string
}

export function RequestCart({ items, onRemoveItem, onClearCart, title = "Sua Solicitação" }: RequestCartProps) {
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0)

  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = []
    }
    acc[item.category].push(item)
    return acc
  }, {} as Record<string, CartItem[]>)

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "uniformes":
      case "polo professor":
        return <Shirt className="h-4 w-4" />
      case "calçados":
        return <Package className="h-4 w-4" />
      case "kits":
      case "mochilas":
        return <BookOpen className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="relative gap-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5">
          <ShoppingCart className="h-4 w-4" />
          <span className="hidden sm:inline">Carrinho</span>
          {totalItems > 0 && (
            <Badge className="absolute -right-2 -top-2 h-5 min-w-5 rounded-full bg-accent px-1.5 text-xs font-semibold text-accent-foreground">
              {totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader className="border-b pb-4">
          <SheetTitle className="flex items-center gap-2 text-lg">
            <ShoppingCart className="h-5 w-5 text-primary" />
            {title}
          </SheetTitle>
        </SheetHeader>
        
        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
            <div className="rounded-full bg-muted p-4">
              <ShoppingCart className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">Nenhum item selecionado</p>
            <p className="text-sm text-muted-foreground/70">Adicione itens preenchendo as quantidades no formulário</p>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-6 py-4">
                {Object.entries(groupedItems).map(([category, categoryItems]) => (
                  <div key={category}>
                    <div className="mb-3 flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary">
                        {getCategoryIcon(category)}
                      </div>
                      <h3 className="font-semibold text-sm uppercase tracking-wide text-foreground/80">{category}</h3>
                      <Badge variant="secondary" className="ml-auto text-xs">
                        {categoryItems.length}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      {categoryItems.map((item) => (
                        <div
                          key={item.id}
                          className="group flex items-center gap-3 rounded-lg border bg-card p-3 transition-colors hover:border-primary/30"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{item.name}</p>
                            {item.details && (
                              <p className="text-xs text-muted-foreground truncate">{item.details}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="tabular-nums font-semibold">
                              x{item.quantity}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive"
                              onClick={() => onRemoveItem(item.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <div className="border-t pt-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total de itens</span>
                <span className="font-semibold text-lg">{totalItems}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={onClearCart}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Limpar Carrinho
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
