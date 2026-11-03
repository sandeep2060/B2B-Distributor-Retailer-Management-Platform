"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatNPR } from "@/lib/utils/formatters";

const monthlyData = [
  { month: "May", sales: 184000, orders: 42 },
  { month: "Jun", sales: 215000, orders: 48 },
  { month: "Jul", sales: 195000, orders: 45 },
  { month: "Aug", sales: 260000, orders: 61 },
  { month: "Sep", sales: 310000, orders: 74 },
  { month: "Oct (Dashain)", sales: 485000, orders: 112 },
  { month: "Nov (Tihar)", sales: 520000, orders: 125 },
];

export const SalesChart: React.FC = () => {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0759C7" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#0759C7" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
          <XAxis dataKey="month" stroke="#64748B" fontSize={11} tickLine={false} />
          <YAxis
            stroke="#64748B"
            fontSize={11}
            tickLine={false}
            tickFormatter={(value) => `Rs.${value / 1000}k`}
          />
          <Tooltip
            formatter={(value: any) => [formatNPR(value), "Wholesale Sales"]}
            contentStyle={{
              backgroundColor: "#102C55",
              borderColor: "#1E293B",
              borderRadius: "8px",
              color: "#fff",
              fontSize: "12px",
            }}
            itemStyle={{ color: "#fff" }}
          />
          <Area
            type="monotone"
            dataKey="sales"
            stroke="#0759C7"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorSales)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
