import React from 'react';
import { TrendingUp, TrendingDown, LucideIcon } from 'lucide-react';

export interface DashboardKPIProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  subtext?: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
  sparklineData?: number[]; // e.g. [12, 18, 14, 25, 22, 35, 40]
  sparklineColor?: string;
  onClick?: () => void;
}

export const DashboardKPIStatCard: React.FC<DashboardKPIProps> = ({
  title,
  value,
  change,
  isPositive = true,
  subtext,
  icon: Icon,
  iconColor = '#D81B60',
  iconBgColor = '#FAF0F7',
  sparklineData = [15, 22, 18, 28, 24, 38, 42],
  sparklineColor = '#10B981',
  onClick,
}) => {
  // Generate simple smooth SVG sparkline path
  const width = 80;
  const height = 28;
  const min = Math.min(...sparklineData);
  const max = Math.max(...sparklineData);
  const range = max - min || 1;

  const points = sparklineData
    .map((val, idx) => {
      const x = (idx / (sparklineData.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 6) - 3;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  const areaPoints = `0,${height} ${points} ${width},${height}`;

  return (
    <div
      onClick={onClick}
      className={`group relative bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_25px_rgba(0,0,0,0.06)] hover:border-slate-300 transition-all duration-200 flex flex-col justify-between overflow-hidden ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      {/* Subtle top ambient accent line on hover */}
      <div 
        className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{ backgroundColor: iconColor }}
      />

      {/* Top Row: Title + Dual-Tone Icon */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            {title}
          </p>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-poppins tracking-tight">
            {value}
          </h3>
        </div>

        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-2xs transition-transform duration-200 group-hover:scale-105"
          style={{ backgroundColor: iconBgColor, color: iconColor }}
        >
          <Icon size={20} strokeWidth={2.2} />
        </div>
      </div>

      {/* Middle/Bottom Row: Sparkline + Trend Badge */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        {/* Trend pill and subtext */}
        <div className="flex flex-col gap-0.5">
          {change && (
            <span
              className={`inline-flex items-center gap-1 font-bold text-[11px] px-2 py-0.5 rounded-full w-fit ${
                isPositive
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/70'
                  : 'bg-rose-50 text-rose-700 border border-rose-200/70'
              }`}
            >
              {isPositive ? <TrendingUp size={11} strokeWidth={2.5} /> : <TrendingDown size={11} strokeWidth={2.5} />}
              <span>{change}</span>
            </span>
          )}
          {subtext && (
            <span className="text-slate-400 font-medium text-[10px] truncate max-w-[120px] mt-0.5">
              {subtext}
            </span>
          )}
        </div>

        {/* Dynamic Micro-Sparkline */}
        <div className="shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
          <svg width={width} height={height} className="overflow-visible">
            <defs>
              <linearGradient id={`grad-${title.replace(/\s+/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={sparklineColor} stopOpacity="0.25" />
                <stop offset="100%" stopColor={sparklineColor} stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <polygon
              points={areaPoints}
              fill={`url(#grad-${title.replace(/\s+/g, '')})`}
            />
            <polyline
              fill="none"
              stroke={sparklineColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
