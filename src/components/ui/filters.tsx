"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type FiltersBarProps = {
  searchPlaceholder?: string;
  searchValue: string;
  onSearchValueChange: (value: string) => void;
  /** Right side controls, e.g. status/plan dropdowns */
  right?: React.ReactNode;
  /** Show the default Filters button */
  showFiltersButton?: boolean;
  onFiltersClick?: () => void;
  className?: string;
};

export function FiltersBar({
  searchPlaceholder = "Search...",
  searchValue,
  onSearchValueChange,
  right,
  showFiltersButton = false,
  onFiltersClick,
  className,
}: FiltersBarProps) {
  return (
    <div className={className ?? "flex flex-wrap items-center gap-2"}>
      <div className="w-full min-w-[320px] flex-1 sm:w-auto md:min-w-[420px]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            className="pl-10"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchValueChange(e.target.value)}
          />
        </div>
      </div>

      {showFiltersButton && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onFiltersClick}
          className="rounded-full border-pink-100 bg-white text-xs text-slate-600 hover:border-pink-200 hover:bg-pink-50"
        >
          Filters
        </Button>
      )}

      {right}
    </div>
  );
}
