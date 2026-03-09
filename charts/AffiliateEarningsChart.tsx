"use client";

import {
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from "recharts";

const data = [
  { name: "Influencers", value: 38 },
  { name: "Beauty creators", value: 26 },
  { name: "Bloggers", value: 18 },
  { name: "Others", value: 18 },
];

const COLORS = ["#ec5a87", "#f9739b", "#fbb6ce", "#fed7e2"];

export function AffiliateEarningsChart() {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            innerRadius={55}
            outerRadius={86}
            paddingAngle={4}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              borderRadius: 16,
              borderColor: "#f9ccd9",
              boxShadow: "0 18px 45px rgba(236,90,135,0.1)",
              fontSize: 11,
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-4 grid grid-cols-2 gap-2 text-[11px] text-slate-500">
        {data.map((d, idx) => (
          <div key={d.name} className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: COLORS[idx] }}
            />
            <span>{d.name}</span>
            <span className="ml-auto font-semibold text-slate-700">
              {d.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

