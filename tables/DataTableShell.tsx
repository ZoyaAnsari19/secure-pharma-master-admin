import { ReactNode, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronLeft, ChevronRight, Filter } from "lucide-react";

export type Column<T> = {
  key: keyof T;
  label: string;
};

type DataTableShellProps<T> = {
  title: string;
  columns: Column<T>[];
  data: T[];
  renderActions?: (row: T) => ReactNode;
  rightHeader?: ReactNode;
};

export function DataTableShell<T extends { id: string | number }>({
  title,
  columns,
  data,
  renderActions,
  rightHeader,
}: DataTableShellProps<T>) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 6;

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

  const items = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <Card className="bg-white">
      <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle>{title}</CardTitle>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="w-full min-w-[220px] flex-1 sm:w-auto">
            <Input
              placeholder="Search..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full border-pink-100 bg-white text-xs text-slate-600 hover:border-pink-200 hover:bg-pink-50"
          >
            <Filter className="mr-1.5 h-3.5 w-3.5" />
            Filters
          </Button>
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
                {renderActions && <TableHead className="w-[120px]">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((row) => (
                <TableRow key={row.id}>
                  {columns.map((col) => (
                    <TableCell key={String(col.key)}>
                      {String(row[col.key])}
                    </TableCell>
                  ))}
                  {renderActions && <TableCell>{renderActions(row)}</TableCell>}
                </TableRow>
              ))}
              {items.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + (renderActions ? 1 : 0)}
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

