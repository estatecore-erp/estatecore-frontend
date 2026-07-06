"use client";

import { Eye } from "lucide-react";
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
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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

type InquiryStatus = "pending" | "responded";

interface Inquiry {
    id: number;
    clientName: string;
    clientEmail: string;
    property: string;
    propertyLocation: string;
    message: string;
    status: InquiryStatus;
}

const mockInquiries: Inquiry[] = [
    {
        id: 1,
        clientName: "John Client",
        clientEmail: "john@gmail.com",
        property: "Modern Villa",
        propertyLocation: "Modern Villa — Colombo 07",
        message: "I am interested in this property, can we schedule a viewing this weekend?",
        status: "pending",
    },
    {
        id: 2,
        clientName: "Sam Client",
        clientEmail: "sam@gmail.com",
        property: "Modern Villa",
        propertyLocation: "Modern Villa — Colombo 07",
        message: "Can I view it Sat morning around 10am?",
        status: "pending",
    },
    {
        id: 3,
        clientName: "Ama Perera",
        clientEmail: "ama.perera@gmail.com",
        property: "City Apartment",
        propertyLocation: "City Apartment — Colombo 03",
        message: "Is parking included with this unit?",
        status: "responded",
    },
    {
        id: 4,
        clientName: "John Client",
        clientEmail: "john@gmail.com",
        property: "Luxury Villa",
        propertyLocation: "Luxury Villa — Colombo 07",
        message: "What's the final price after negotiation?",
        status: "pending",
    },
    {
        id: 5,
        clientName: "Sam Client",
        clientEmail: "sam@gmail.com",
        property: "City Apartment",
        propertyLocation: "City Apartment — Colombo 03",
        message: "Is this still available for rent?",
        status: "responded",
    },
];

function truncate(text: string, max = 30) {
    return text.length > max ? `${text.slice(0, max).trimEnd()}...` : text;
}

function initials(name: string) {
    return name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
}

const InquiriesListSection = () => {
    const [page, setPage] = useState(1);
    const [inquiries, setInquiries] = useState<Inquiry[]>(mockInquiries);
    const [selected, setSelected] = useState<Inquiry | null>(null);

    const totalPages = Math.ceil(inquiries.length / PAGE_SIZE);
    const paginatedInquiries = inquiries.slice(
        (page - 1) * PAGE_SIZE,
        page * PAGE_SIZE,
    );

    const markResponded = (id: number) => {
        setInquiries((prev) =>
            prev.map((inq) =>
                inq.id === id ? { ...inq, status: "responded" as const } : inq,
            ),
        );
        setSelected((prev) =>
            prev && prev.id === id ? { ...prev, status: "responded" } : prev,
        );
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h1 className="text-2xl font-semibold">Inquiries</h1>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                <Input
                    placeholder="Search by client or property"
                    className="flex-1 max-w-md"
                />
                <div className="flex gap-2">
                    <Select>
                        <SelectTrigger className="w-full sm:w-35">
                            <SelectValue placeholder="All statuses" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All statuses</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="responded">Responded</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="border rounded-lg overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Client</TableHead>
                            <TableHead>Property</TableHead>
                            <TableHead>Message</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedInquiries.map((inquiry) => (
                            <TableRow key={inquiry.id}>
                                <TableCell className="font-medium whitespace-nowrap">
                                    {inquiry.clientName}
                                </TableCell>
                                <TableCell className="whitespace-nowrap">
                                    {inquiry.property}
                                </TableCell>
                                <TableCell className="max-w-xs truncate">
                                    {truncate(inquiry.message)}
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        className={`${statusVariant[inquiry.status]} w-24 justify-center capitalize`}
                                    >
                                        {inquiry.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right space-x-2 whitespace-nowrap">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setSelected(inquiry)}
                                    >
                                        <Eye className="w-4 h-4" />
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

            <Dialog
                open={selected !== null}
                onOpenChange={(open) => !open && setSelected(null)}
            >
                <DialogContent className="sm:max-w-md">
                    {selected && (
                        <div className="space-y-5">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-11 w-11">
                                    <AvatarFallback className="bg-emerald-100 font-semibold text-emerald-800">
                                        {initials(selected.clientName)}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">{selected.clientName}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {selected.clientEmail}
                                    </p>
                                </div>
                            </div>

                            <div className="h-px w-full bg-border" />

                            <div>
                                <p className="mb-1 text-sm text-muted-foreground">Property</p>
                                <p className="font-medium">{selected.propertyLocation}</p>
                            </div>

                            <div>
                                <p className="mb-1 text-sm text-muted-foreground">Message</p>
                                <p className="font-medium">{selected.message}</p>
                            </div>

                            <div className="flex justify-end gap-2 pt-1">
                                <Button variant="outline" onClick={() => setSelected(null)}>
                                    Close
                                </Button>
                                <Button onClick={() => markResponded(selected.id)}>
                                    Mark responded
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default InquiriesListSection;
