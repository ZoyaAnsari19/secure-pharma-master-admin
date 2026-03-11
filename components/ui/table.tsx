"use client";

import * as React from "react";
import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Filter, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <table
    ref={ref}
    className={cn(
      "w-full border-collapse text-sm text-slate-700",
      className
    )}
    {...props}
  />
));
Table.displayName = "Table";

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn("bg-gray-50 text-xs font-semibold text-gray-600", className)}
    {...props}
  />
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("divide-y divide-gray-100", className)}
    {...props}
  />
));
TableBody.displayName = "TableBody";

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "transition-colors hover:bg-pink-50 data-[state=selected]:bg-gray-100",
      className
    )}
    {...props}
  />
));
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn("px-4 py-3 text-left align-middle", className)}
    {...props}
  />
));
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn("px-6 py-4 align-middle text-sm text-gray-600", className)}
    {...props}
  />
));
TableCell.displayName = "TableCell";

// Reusable data table with search, filters, pagination
export type Column<T> = {
  key: keyof T;
  label: string;
  /**
   * Optional custom cell render (e.g. for badges, tags, serial numbers).
   * The second argument is the zero-based absolute row index in the filtered data.
   */
  render?: (row: T, index: number) => React.ReactNode;
};

export type DataTableProps<T> = {
  title: string;
  columns: Column<T>[];
  data: T[];
  renderActions?: (row: T) => ReactNode;
  /**
   * If provided, actions will be shown under a 3-dots menu (⋮) in the Actions column.
   * Return menu items (e.g. <DropdownMenuItem />s) from this render function.
   */
  renderActionMenuItems?: (row: T) => ReactNode;
  rightHeader?: ReactNode;
  pageSize?: number;
  searchPlaceholder?: string;
  /** Hide the default Filters button when using custom filter UI (e.g. role dropdown) */
  hideFiltersButton?: boolean;
};

export function DataTable<T extends { id: string | number }>({
  title,
  columns,
  data,
  renderActions,
  renderActionMenuItems,
  rightHeader,
  pageSize = 6,
  searchPlaceholder = "Search...",
  hideFiltersButton = false,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(
    () =>
      data.filter((row) =>
        JSON.stringify(row)
          .toLowerCase()
          .includes(search.toLowerCase())
      ),
    [data, search]
  );

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount);

  const startIndex = (currentPage - 1) * pageSize;
  const items = filtered.slice(startIndex, startIndex + pageSize);

  return (
    <Card className="bg-white">
      <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle>{title}</CardTitle>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="w-full min-w-[220px] flex-1 sm:w-auto">
            <Input
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          {!hideFiltersButton && (
            <Button
              variant="outline"
              size="sm"
              className="rounded-full border-pink-100 bg-white text-xs text-slate-600 hover:border-pink-200 hover:bg-pink-50"
            >
              <Filter className="mr-1.5 h-3.5 w-3.5" />
              Filters
            </Button>
          )}
          {rightHeader}
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white">
          <Table className="min-w-[640px]">
            <TableHeader>
              <TableRow>
                {columns.map((col) => (
                  <TableHead key={String(col.key)}>{col.label}</TableHead>
                ))}
                {(renderActions || renderActionMenuItems) && (
                  <TableHead className="w-[120px]">Actions</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((row, rowIndex) => {
                const absoluteIndex = startIndex + rowIndex;
                return (
                  <TableRow key={row.id}>
                    {columns.map((col) => (
                      <TableCell key={String(col.key)}>
                        {col.render
                          ? col.render(row, absoluteIndex)
                          : String(row[col.key] ?? "")}
                      </TableCell>
                    ))}
                    {(renderActions || renderActionMenuItems) && (
                      <TableCell>
                        {renderActionMenuItems ? (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7 rounded-full border-pink-100 bg-white text-slate-500 shadow-none hover:border-pink-200 hover:bg-pink-50 hover:shadow-none focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {renderActionMenuItems(row)}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        ) : (
                          renderActions?.(row)
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
              {items.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={
                      columns.length + (renderActions || renderActionMenuItems ? 1 : 0)
                    }
                    className="py-8 text-center text-xs text-slate-400"
                  >
                    No data available for the current filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 flex flex-col gap-2 text-[11px] text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Showing{" "}
            <span className="font-semibold text-slate-700">
              {items.length || 0}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-700">
              {filtered.length}
            </span>{" "}
            records
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              disabled={currentPage === 1}
              className="h-7 w-7 rounded-full border-pink-100 bg-white text-slate-500 hover:border-pink-200 hover:bg-pink-50"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            <span>
              Page{" "}
              <span className="font-semibold text-slate-700">
                {currentPage}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-700">{pageCount}</span>
            </span>
            <Button
              variant="outline"
              size="icon"
              disabled={currentPage === pageCount}
              className="h-7 w-7 rounded-full border-pink-100 bg-white text-slate-500 hover:border-pink-200 hover:bg-pink-50"
              onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell };

