"use client"

import { useState } from "react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Hardcoded options — replace with real data fetching later
const PROPERTIES = [
  { value: "luxury-villa", label: "Luxury Villa — Colombo 07" },
  { value: "hillside-bungalow", label: "Hillside Bungalow — Kandy" },
]

const CLIENTS = [
  { value: "john-client", label: "John Client" },
  { value: "ama-perera", label: "Ama Perera" },
]

export default function SalesCreatePage() {
  const [property, setProperty] = useState(PROPERTIES[0].value)
  const [client, setClient] = useState(CLIENTS[0].value)
  const [salePrice, setSalePrice] = useState("")
  const [saleDate, setSaleDate] = useState("")

  const handleCreate = () => {
    // TODO: wire up real create mutation
  }

  return (
    <div className="p-6">
      <p className="mb-4 text-sm text-muted-foreground">
        /dashboard/sales/create
      </p>

      <div className="max-w-2xl rounded-xl border bg-card p-6">
        <div className="space-y-2">
          <Label htmlFor="property">
            Property{" "}
            <span className="text-muted-foreground">(sale + available only)</span>
          </Label>
          <Select value={property} onValueChange={setProperty}>
            <SelectTrigger id="property">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PROPERTIES.map((p) => (
                <SelectItem key={p.value} value={p.value}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="client">Client</Label>
            <Select value={client} onValueChange={setClient}>
              <SelectTrigger id="client">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CLIENTS.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sale-price">Sale price</Label>
            <Input
              id="sale-price"
              type="number"
              placeholder="490000"
              value={salePrice}
              onChange={(e) => setSalePrice(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-6 space-y-2">
          <Label htmlFor="sale-date">Sale date</Label>
          <Input
            id="sale-date"
            type="date"
            value={saleDate}
            onChange={(e) => setSaleDate(e.target.value)}
          />
        </div>

        <div className="mt-8 flex justify-end gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/sales">Cancel</Link>
          </Button>
          <Button onClick={handleCreate}>Create sale</Button>
        </div>
      </div>
    </div>
  )
}