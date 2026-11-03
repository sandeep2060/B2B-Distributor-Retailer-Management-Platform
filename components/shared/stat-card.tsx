import React from "react";
import { Card, CardContent } from "../ui/card";
import { ArrowUpRight, ArrowDownRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: {
    value: number;
    isPositive: boolean;
  };
  icon: LucideIcon;
  iconColor?: "blue" | "navy" | "orange" | "green" | "purple";
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  change,
  icon: Icon,
  iconColor = "blue",
}) => {
  const iconBgs = {
    blue: "bg-blue-50 text-[#0759C7]",
    navy: "bg-slate-100 text-[#102C55]",
    orange: "bg-orange-50 text-[#F58220]",
    green: "bg-emerald-50 text-emerald-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <Card className="hover:shadow-card transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
            <p className="text-2xl font-black text-[#102C55] tracking-tight">{value}</p>
          </div>
          <div className={cn("p-2.5 rounded-xl", iconBgs[iconColor])}>
            <Icon className="w-5 h-5" />
          </div>
        </div>

        {(subtitle || change) && (
          <div className="mt-4 flex items-center text-xs space-x-2">
            {change && (
              <span
                className={cn(
                  "inline-flex items-center font-bold px-1.5 py-0.5 rounded",
                  change.isPositive ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                )}
              >
                {change.isPositive ? (
                  <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                ) : (
                  <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
                )}
                {change.value}%
              </span>
            )}
            {subtitle && <span className="text-slate-500">{subtitle}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
