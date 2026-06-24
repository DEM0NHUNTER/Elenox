/**
Distributed Micro-Quota Operational Performance Panel.
Manages atomic calculation values for localized tenant financial resource allocation tracking.
Updated: Migrated to semantic Tailwind theme classes for full palette integration.
*/
import React from 'react';
import { DollarSign, Layers, Zap } from 'lucide-react';

interface QuickStatsProps {
  totalCost: number;
  totalInputTokens: number;
  totalOutputTokens: number;
}

export default function QuickStats({ totalCost, totalInputTokens, totalOutputTokens }: QuickStatsProps): React.JSX.Element {
  return (
    <div className="bg-card border border-border rounded-xl p-4 h-full flex flex-col justify-between w-full">
      <div className="flex justify-between items-center border-b border-border pb-2">
        <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Tracker</span>
        <Zap className="w-3.5 h-3.5 text-primary" />
      </div>

      <div className="grid grid-cols-3 gap-2 mt-3 flex-1 items-center">
        <div className="flex flex-col">
          <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest mb-1 flex items-center">
            <DollarSign className="w-2.5 h-2.5" /> FinOps
          </span>
          <span className="text-sm font-bold text-foreground tabular-nums tracking-tight">
            €{totalCost.toFixed(4)}
          </span>
        </div>

        <div className="flex flex-col border-l border-border pl-2">
          <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest mb-1 flex items-center gap-0.5">
            <Layers className="w-2.5 h-2.5 text-primary" /> Prompt
          </span>
          <span className="text-sm font-bold text-foreground tabular-nums tracking-tight">
            {totalInputTokens.toLocaleString()}
          </span>
        </div>

        <div className="flex flex-col border-l border-border pl-2">
          <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest mb-1 flex items-center gap-0.5">
            <Layers className="w-2.5 h-2.5 text-primary" /> Gen
          </span>
          <span className="text-sm font-bold text-foreground tabular-nums tracking-tight">
            {totalOutputTokens.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}