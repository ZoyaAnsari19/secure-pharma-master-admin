import { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";

const CARD_VARIANTS = [
  { iconBg: "bg-blue-50", iconText: "text-blue-600", badgeBg: "bg-blue-50", badgeText: "text-blue-700" },
  { iconBg: "bg-emerald-50", iconText: "text-emerald-600", badgeBg: "bg-emerald-50", badgeText: "text-emerald-700" },
  { iconBg: "bg-violet-50", iconText: "text-violet-600", badgeBg: "bg-violet-50", badgeText: "text-violet-700" },
  { iconBg: "bg-amber-50", iconText: "text-amber-600", badgeBg: "bg-amber-50", badgeText: "text-amber-700" },
  { iconBg: "bg-sky-50", iconText: "text-sky-600", badgeBg: "bg-sky-50", badgeText: "text-sky-700" },
  { iconBg: "bg-rose-50", iconText: "text-rose-600", badgeBg: "bg-rose-50", badgeText: "text-rose-700" },
  { iconBg: "bg-indigo-50", iconText: "text-indigo-600", badgeBg: "bg-indigo-50", badgeText: "text-indigo-700" },
] as const;

type KpiCardProps = {
  title: string;
  value: string | number;
  delta: string;
  icon: ReactNode;
  variant: (typeof CARD_VARIANTS)[number];
};

export function KpiCard({ title, value, delta, icon, variant }: KpiCardProps) {
  return (
    <div className="flex h-full min-h-[140px] flex-col justify-between rounded-xl border border-gray-100 bg-white px-5 py-4 shadow-[0_1px_3px_0_rgba(0,0,0,0.06),0_1px_2px_-1px_rgba(0,0,0,0.06)] transition-shadow hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.07),0_2px_4px_-2px_rgba(0,0,0,0.07)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
            {title}
          </p>
          <p className="mt-1.5 text-2xl font-bold tracking-tight text-gray-900 tabular-nums">
            {value}
          </p>
        </div>
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${variant.iconBg} ${variant.iconText}`}>
          {icon}
        </div>
      </div>
      <div className="mt-3 flex items-center">
        <span className={`inline-flex items-center gap-1 rounded-full ${variant.badgeBg} px-2.5 py-0.5 text-[11px] font-medium ${variant.badgeText}`}>
          <ArrowUpRight className="h-3 w-3 shrink-0" strokeWidth={2.5} />
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
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item, index) => (
        <KpiCard
          key={item.title}
          title={item.title}
          value={item.value}
          delta={item.delta}
          icon={item.icon}
          variant={CARD_VARIANTS[index % CARD_VARIANTS.length]}
        />
      ))}
    </div>
  );
}
