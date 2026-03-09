import { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";

type KpiCardProps = {
  title: string;
  value: string | number;
  delta: string;
  icon: ReactNode;
};

export function KpiCard({ title, value, delta, icon }: KpiCardProps) {
  return (
    <div className="flex flex-col justify-between rounded-3xl border border-gray-200 bg-white px-6 py-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-gray-900">
            {value}
          </p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-50 text-gray-900">
          {icon}
        </div>
      </div>
      <div className="mt-4">
        <span className="inline-flex items-center rounded-full bg-pink-50 px-3 py-1 text-[11px] font-medium text-pink-600">
          <ArrowUpRight className="mr-1 h-3 w-3" />
          {delta}
        </span>
      </div>
    </div>
  );
}

export type KpiItem = {
  title: string;
  value: string | number;
  delta: string;
  icon: ReactNode;
};

type KpiCardsProps = {
  items: KpiItem[];
};

export function KpiCards({ items }: KpiCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
      {items.map((item) => (
        <KpiCard
          key={item.title}
          title={item.title}
          value={item.value}
          delta={item.delta}
          icon={item.icon}
        />
      ))}
    </div>
  );
}

