"use client";

import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { cn } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FiltersBar } from "@/components/ui/filters";
import { ChevronLeft, ChevronRight, Filter, MoreVertical, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
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
    className={cn("px-6 py-3 text-left align-middle", className)}
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
  /** Optional row click handler, e.g. to open a side drawer with details */
  onRowClick?: (row: T) => void;
  rightHeader?: ReactNode;
  pageSize?: number;
  searchPlaceholder?: string;
  /** Controlled search value (optional). When provided, DataTable will not manage its own search state. */
  searchValue?: string;
  /** Controlled search handler (optional). Used when `searchValue` is provided. */
  onSearchValueChange?: (value: string) => void;
  /** Optional override for the header controls area (search + filters + rightHeader). */
  headerContent?: ReactNode;
  /** Hide the default Filters button when using custom filter UI (e.g. role dropdown) */
  hideFiltersButton?: boolean;
  /** When true, show a leading Sr No. column based on filtered + paginated index */
  showIndexColumn?: boolean;
  indexColumnLabel?: string;
};

export function DataTable<T extends { id: string | number }>({
  title,
  columns,
  data,
  renderActions,
  renderActionMenuItems,
  onRowClick,
  rightHeader,
  pageSize = 6,
  searchPlaceholder = "Search...",
  searchValue,
  onSearchValueChange,
  headerContent,
  hideFiltersButton = false,
  showIndexColumn = false,
  indexColumnLabel = "Sr No.",
}: DataTableProps<T>) {
  const [uncontrolledSearch, setUncontrolledSearch] = useState("");
  const [page, setPage] = useState(1);

  const effectiveSearch = searchValue ?? uncontrolledSearch;
  const setSearch = (value: string) => {
    if (searchValue !== undefined) {
      onSearchValueChange?.(value);
    } else {
      setUncontrolledSearch(value);
    }
  };

  useEffect(() => {
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveSearch]);

  const filtered = useMemo(
    () =>
      data.filter((row) =>
        JSON.stringify(row)
          .toLowerCase()
          .includes(effectiveSearch.toLowerCase())
      ),
    [data, effectiveSearch]
  );

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount);

  const startIndex = (currentPage - 1) * pageSize;
  const items = filtered.slice(startIndex, startIndex + pageSize);

  return (
    <Card className="min-w-0 bg-white">
      <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <CardTitle>{title}</CardTitle>
        </div>
        {headerContent ?? (
          <>
            {/* Mobile: search + filters on same row */}
            <div className="flex w-full items-center gap-2 sm:hidden">
              <div className="relative min-w-0 flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  className="pl-10"
                  placeholder={searchPlaceholder}
                  value={effectiveSearch}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {!hideFiltersButton && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="shrink-0 rounded-full border-pink-100 bg-white text-xs text-slate-600 hover:border-pink-200 hover:bg-pink-50"
                >
                  <Filter className="mr-1.5 h-3.5 w-3.5" />
                  Filters
                </Button>
              )}

              {rightHeader}
            </div>

            {/* Desktop/tablet: existing filters bar */}
            <div className="hidden w-full sm:block">
              <FiltersBar
                searchPlaceholder={searchPlaceholder}
                searchValue={effectiveSearch}
                onSearchValueChange={setSearch}
                right={
                  <>
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
                  </>
                }
              />
            </div>
          </>
        )}
      </CardHeader>
      <CardContent className="px-0 sm:px-6">
        {/* Mobile: data cards */}
        <div className="px-4 sm:hidden">
          <div className="space-y-3">
            {items.map((row, rowIndex) => {
              const absoluteIndex = startIndex + rowIndex;
              return (
                <div
                  key={row.id}
                  className={cn(
                    "min-w-0 rounded-xl border border-gray-100 bg-white p-4 shadow-sm",
                    onRowClick && "cursor-pointer hover:border-pink-200 hover:bg-pink-50/30"
                  )}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      {showIndexColumn && (
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-400">
                          {indexColumnLabel} {absoluteIndex + 1}
                        </p>
                      )}
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {String(row[columns[0]?.key] ?? title)}
                      </p>
                    </div>

                    {(renderActions || renderActionMenuItems) && (
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        {renderActionMenuItems ? (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 rounded-full border border-pink-100 bg-white text-slate-500 shadow-none hover:border-pink-200 hover:bg-pink-50 hover:shadow-none focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:ring-transparent focus-visible:border-pink-200"
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
                      </div>
                    )}
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2">
                    {columns.slice(0).map((col) => (
                      <div key={String(col.key)} className="min-w-0">
                        <p className="text-[11px] font-medium text-gray-400">
                          {col.label}
                        </p>
                        <div className="truncate text-sm text-gray-700">
                          {col.render
                            ? col.render(row, absoluteIndex)
                            : String(row[col.key] ?? "")}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {items.length === 0 && (
              <div className="rounded-xl border border-gray-100 bg-white p-6 text-center text-xs text-slate-400">
                No data available for the current filters.
              </div>
            )}
          </div>
        </div>

        {/* Desktop/tablet: table */}
        <div className="hidden min-w-0 overflow-x-auto border-y border-gray-100 bg-white sm:block sm:rounded-xl sm:border">
          <div className="min-w-[640px] px-4 sm:px-0">
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  {showIndexColumn && (
                    <TableHead className="w-[70px] whitespace-nowrap text-center">
                      {indexColumnLabel}
                    </TableHead>
                  )}
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
                    <TableRow
                      key={row.id}
                      className={cn(
                        onRowClick && "cursor-pointer hover:bg-pink-50/70"
                      )}
                      onClick={
                        onRowClick
                          ? () => {
                              onRowClick(row);
                            }
                          : undefined
                      }
                    >
                      {showIndexColumn && (
                        <TableCell className="px-6 text-center text-xs text-gray-500">
                          {absoluteIndex + 1}
                        </TableCell>
                      )}
                      {columns.map((col) => (
                        <TableCell key={String(col.key)}>
                          {col.render
                            ? col.render(row, absoluteIndex)
                            : String(row[col.key] ?? "")}
                        </TableCell>
                      ))}
                      {(renderActions || renderActionMenuItems) && (
                        <TableCell
                          onClick={(e) => {
                            // Prevent row click handler from firing when interacting with actions
                            e.stopPropagation();
                          }}
                        >
                          {renderActionMenuItems ? (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-7 w-7 rounded-full border border-pink-100 bg-white text-slate-500 shadow-none hover:border-pink-200 hover:bg-pink-50 hover:shadow-none focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:ring-transparent focus-visible:border-pink-200"
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
                        columns.length +
                        (renderActions || renderActionMenuItems ? 1 : 0) +
                        (showIndexColumn ? 1 : 0)
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
        </div>

        <div className="mt-4 flex flex-row flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
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
          <div className="flex items-center justify-end gap-2 self-end sm:self-auto">
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
