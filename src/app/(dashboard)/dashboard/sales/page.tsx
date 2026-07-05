"use client"

import { useState } from "react"
import Link from "next/link"
import { MoreHorizontal, Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// Hardcoded data — replace with real data fetching later
const SALES = [
  {
    id: "1",
    property: "Luxury Villa",
    client: "John Client",
    price: "LKR 490,000",
    date: "Jun 29, 2026",
  },
  {
    id: "2",
    property: "Hillside Bungalow",
    client: "Ama Perera",
    price: "LKR 315,000",
    date: "Jun 12, 2026",
  },
]

export default function SalesListPage() {
  const [saleToDelete, setSaleToDelete] = useState<typeof SALES[number] | null>(
    null
  )

  const handleDelete = () => {
    // TODO: wire up real delete mutation
    setSaleToDelete(null)
  }

  return (
    <div className="p-6">
      <p className="mb-4 text-sm text-muted-foreground">/dashboard/sales</p>

      <div className="rounded-xl border bg-card">
        <div className="flex items-center justify-between border-b p-4">
          <div />
          <div className="flex items-center gap-2">
            <Button asChild>
              <Link href="/dashboard/sales/create">
                <Plus className="mr-1.5 h-4 w-4" />
                Add sale
              </Link>
            </Button>
            <Button variant="outline" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Property</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Sale price</TableHead>
              <TableHead>Sale date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {SALES.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell className="font-medium">{sale.property}</TableCell>
                <TableCell className="font-medium">{sale.client}</TableCell>
                <TableCell>{sale.price}</TableCell>
                <TableCell className="text-muted-foreground">
                  {sale.date}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setSaleToDelete(sale)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog
        open={!!saleToDelete}
        onOpenChange={(open) => !open && setSaleToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete sale?</AlertDialogTitle>
            <AlertDialogDescription>
              {saleToDelete?.property} — {saleToDelete?.client}. Property
              reverts to available. This can&apos;t be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}