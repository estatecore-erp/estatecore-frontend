"use client";

import Link from "next/link";
import { Eye, Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/formatters";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useState } from "react";
import { PAGE_SIZE, statusVariant } from "@/lib/constants";

const mockProperties = [
  {
    id: 1,
    title: "Modern Villa",
    type: "sale",
    status: "available",
    price: "250000.00",
    location: "Colombo 07",
    agent: { name: "Jane Agent" },
  },
  {
    id: 2,
    title: "City Apartment",
    type: "rent",
    status: "rented",
    price: "25000.00",
    location: "Colombo 03",
    agent: { name: "Jane Agent" },
  },
  {
    id: 3,
    title: "Luxury Villa",
    type: "sale",
    status: "sold",
    price: "490000.00",
    location: "Colombo 07",
    agent: { name: "Jane Agent" },
  },
  {
    id: 4,
    title: "Modern Villa",
    type: "sale",
    status: "available",
    price: "250000.00",
    location: "Colombo 07",
    agent: { name: "Jane Agent" },
  },
  {
    id: 5,
    title: "City Apartment",
    type: "rent",
    status: "rented",
    price: "25000.00",
    location: "Colombo 03",
    agent: { name: "Jane Agent" },
  },
  {
    id: 6,
    title: "Luxury Villa",
    type: "sale",
    status: "sold",
    price: "490000.00",
    location: "Colombo 07",
    agent: { name: "Jane Agent" },
  },
  {
    id: 7,
    title: "Modern Villa",
    type: "sale",
    status: "available",
    price: "250000.00",
    location: "Colombo 07",
    agent: { name: "Jane Agent" },
  },
  {
    id: 8,
    title: "City Apartment",
    type: "rent",
    status: "rented",
    price: "25000.00",
    location: "Colombo 03",
    agent: { name: "Jane Agent" },
  },
  {
    id: 9,
    title: "Luxury Villa",
    type: "sale",
    status: "sold",
    price: "490000.00",
    location: "Colombo 07",
    agent: { name: "Jane Agent" },
  },
  {
    id: 10,
    title: "Modern Villa",
    type: "sale",
    status: "available",
    price: "250000.00",
    location: "Colombo 07",
    agent: { name: "Jane Agent" },
  },
  {
    id: 11,
    title: "City Apartment",
    type: "rent",
    status: "rented",
    price: "25000.00",
    location: "Colombo 03",
    agent: { name: "Jane Agent" },
  },
  {
    id: 12,
    title: "Luxury Villa",
    type: "sale",
    status: "sold",
    price: "490000.00",
    location: "Colombo 07",
    agent: { name: "Jane Agent" },
  },
  {
    id: 13,
    title: "Modern Villa",
    type: "sale",
    status: "available",
    price: "250000.00",
    location: "Colombo 07",
    agent: { name: "Jane Agent" },
  },
  {
    id: 14,
    title: "City Apartment",
    type: "rent",
    status: "rented",
    price: "25000.00",
    location: "Colombo 03",
    agent: { name: "Jane Agent" },
  },
  {
    id: 15,
    title: "Luxury Villa",
    type: "sale",
    status: "sold",
    price: "490000.00",
    location: "Colombo 07",
    agent: { name: "Jane Agent" },
  },
  {
    id: 16,
    title: "Modern Villa",
    type: "sale",
    status: "available",
    price: "250000.00",
    location: "Colombo 07",
    agent: { name: "Jane Agent" },
  },
  {
    id: 17,
    title: "City Apartment",
    type: "rent",
    status: "rented",
    price: "25000.00",
    location: "Colombo 03",
    agent: { name: "Jane Agent" },
  },
  {
    id: 18,
    title: "Luxury Villa",
    type: "sale",
    status: "sold",
    price: "490000.00",
    location: "Colombo 07",
    agent: { name: "Jane Agent" },
  },
  {
    id: 19,
    title: "Modern Villa",
    type: "sale",
    status: "available",
    price: "250000.00",
    location: "Colombo 07",
    agent: { name: "Jane Agent" },
  },
];

const PropertiesListSection = () => {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(mockProperties.length / PAGE_SIZE);
  const paginatedProperties = mockProperties.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-semibold">Properties</h1>
        <Button asChild>
          <Link href="/dashboard/properties/create">
            <Plus className="w-4 h-4 mr-2" />
            Add property
          </Link>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
        <Input
          placeholder="Search by title or location"
          className="flex-1 max-w-md"
        />
        <div className="flex gap-2">
          <Select>
            <SelectTrigger className="w-full sm:w-35">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="sale">Sale</SelectItem>
              <SelectItem value="rent">Rent</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-full sm:w-35">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="rented">Rented</SelectItem>
              <SelectItem value="sold">Sold</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Agent</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedProperties.map((property) => (
              <TableRow key={property.id}>
                <TableCell className="font-medium whitespace-nowrap">
                  {property.title}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {property.location}
                </TableCell>
                <TableCell className="capitalize">{property.type}</TableCell>
                <TableCell>
                  <Badge
                    className={`${statusVariant[property.status]} w-24 justify-center capitalize`}
                  >
                    {property.status}
                  </Badge>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {formatCurrency(property.price)}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {property.agent.name}
                </TableCell>
                <TableCell className="text-right space-x-2 whitespace-nowrap">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/dashboard/properties/${property.id}`}>
                      <Eye className="w-4 h-4" />
                    </Link>
                  </Button>
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/dashboard/properties/${property.id}/edit`}>
                      <Pencil className="w-4 h-4" />
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setPage((p) => Math.max(1, p - 1));
                }}
                className={page === 1 ? "pointer-events-none opacity-50" : ""}
                aria-disabled={page === 1}
              />
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <PaginationItem key={n}>
                <PaginationLink
                  href="#"
                  isActive={n === page}
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(n);
                  }}
                >
                  {n}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setPage((p) => Math.min(totalPages, p + 1));
                }}
                className={
                  page === totalPages ? "pointer-events-none opacity-50" : ""
                }
                aria-disabled={page === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default PropertiesListSection;
