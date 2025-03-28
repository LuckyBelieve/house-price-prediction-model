"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Clock, Search, Check, X, ArrowUpDown } from "lucide-react";
import { HistoricalDataPoint } from "@/types";
import Layout from "@/components/layout/layout";

// Sample data for demonstration
const sampleData: HistoricalDataPoint[] = Array.from(
  { length: 25 },
  (_, i) => ({
    id: i + 1,
    date: new Date(2023, 9 - Math.floor(i / 5), 15 - (i % 5))
      .toISOString()
      .split("T")[0],
    property_type: [
      "single_family",
      "multi_family",
      "condo",
      "apartment",
      "townhouse",
    ][i % 5] as any,
    sqft: 1800 + i * 100,
    bedrooms: 2 + (i % 4),
    bathrooms: 1.5 + (i % 3),
    location_rating: 5 + (i % 6),
    property_age: 5 + i * 2,
    has_garage: i % 3 === 0,
    has_pool: i % 5 === 0,
    school_quality: 6 + (i % 5),
    crime_rate: 2 + (i % 8),
    predicted_price: 350000 + i * 15000,
    actual_price: 345000 + i * 15000 + (i % 3) * 10000,
    sale_price: i % 2 === 0 ? 342000 + i * 15000 : 0, // Some properties might not be sold
  })
);

export default function HistoryPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof HistoricalDataPoint>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [searchTerm, setSearchTerm] = useState("");

  const itemsPerPage = 10;

  // Filter data based on search term
  const filteredData = sampleData.filter(
    (item) =>
      item.property_type.includes(searchTerm.toLowerCase()) ||
      item.date.includes(searchTerm) ||
      item.sqft.toString().includes(searchTerm) ||
      item.predicted_price.toString().includes(searchTerm)
  );

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (a[sortField] < b[sortField]) return sortDirection === "asc" ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Paginate data
  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Handle sort click
  const handleSort = (field: keyof HistoricalDataPoint) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-3">
            <span className="bg-primary/10 p-2 rounded-lg">
              <Clock className="h-6 w-6 text-primary" />
            </span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-3">
            Prediction <span className="text-primary">History</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Review past property valuations and compare with actual sales
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Search & Filter</CardTitle>
            <CardDescription>Find specific property valuations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="text"
                placeholder="Search by property type, date, size, or price..."
                className="pl-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Prediction History</CardTitle>
            <CardDescription>
              Historical property valuations and actual sales data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead
                      onClick={() => handleSort("date")}
                      className="cursor-pointer"
                    >
                      <div className="flex items-center">
                        Date <ArrowUpDown className="ml-2 h-3 w-3" />
                      </div>
                    </TableHead>
                    <TableHead
                      onClick={() => handleSort("property_type")}
                      className="cursor-pointer"
                    >
                      <div className="flex items-center">
                        Type <ArrowUpDown className="ml-2 h-3 w-3" />
                      </div>
                    </TableHead>
                    <TableHead
                      onClick={() => handleSort("sqft")}
                      className="cursor-pointer text-right"
                    >
                      <div className="flex items-center justify-end">
                        Size <ArrowUpDown className="ml-2 h-3 w-3" />
                      </div>
                    </TableHead>
                    <TableHead
                      onClick={() => handleSort("bedrooms")}
                      className="cursor-pointer text-right"
                    >
                      <div className="flex items-center justify-end">
                        Beds <ArrowUpDown className="ml-2 h-3 w-3" />
                      </div>
                    </TableHead>
                    <TableHead
                      onClick={() => handleSort("bathrooms")}
                      className="cursor-pointer text-right"
                    >
                      <div className="flex items-center justify-end">
                        Baths <ArrowUpDown className="ml-2 h-3 w-3" />
                      </div>
                    </TableHead>
                    <TableHead
                      onClick={() => handleSort("predicted_price")}
                      className="cursor-pointer text-right"
                    >
                      <div className="flex items-center justify-end">
                        Predicted <ArrowUpDown className="ml-2 h-3 w-3" />
                      </div>
                    </TableHead>
                    <TableHead
                      onClick={() => handleSort("actual_price")}
                      className="cursor-pointer text-right"
                    >
                      <div className="flex items-center justify-end">
                        Actual <ArrowUpDown className="ml-2 h-3 w-3" />
                      </div>
                    </TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.map((item) => {
                    const priceDiff = item.actual_price - item.predicted_price;
                    const percentDiff = (
                      (priceDiff / item.predicted_price) *
                      100
                    ).toFixed(1);
                    const isAccurate = Math.abs(Number(percentDiff)) < 5;

                    return (
                      <TableRow key={item.id}>
                        <TableCell>{item.date}</TableCell>
                        <TableCell className="capitalize">
                          {item.property_type.replace("_", " ")}
                        </TableCell>
                        <TableCell className="text-right">
                          {item.sqft.toLocaleString()} sqft
                        </TableCell>
                        <TableCell className="text-right">
                          {item.bedrooms}
                        </TableCell>
                        <TableCell className="text-right">
                          {item.bathrooms}
                        </TableCell>
                        <TableCell className="text-right">
                          ${item.predicted_price.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          ${item.actual_price.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {isAccurate ? (
                            <div className="flex items-center text-green-600">
                              <Check size={16} className="mr-1" />
                              <span>Accurate ({percentDiff}%)</span>
                            </div>
                          ) : (
                            <div className="flex items-center text-amber-600">
                              <X size={16} className="mr-1" />
                              <span>Off by {percentDiff}%</span>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(1, prev - 1))
                        }
                        className={
                          currentPage === 1
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>

                    {Array.from({ length: totalPages }).map((_, index) => (
                      <PaginationItem key={index}>
                        <PaginationLink
                          isActive={currentPage === index + 1}
                          onClick={() => setCurrentPage(index + 1)}
                        >
                          {index + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(totalPages, prev + 1)
                          )
                        }
                        className={
                          currentPage === totalPages
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
