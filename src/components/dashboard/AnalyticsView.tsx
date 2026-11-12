import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Activity,
  Layers,
  Globe,
  Zap,
  ShieldCheck
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  // SVG Chart data points for MRR
  const mrrData = [
    { label: 'W1', value: 118 },
    { label: 'W2', value: 126 },
    { label: 'W3', value: 134 },
    { label: 'W4', value: 148 },
  ];

  // Requests per day in millions
  const requestPoints = [
    { day: 'Mon', count: 18.2 },
    { day: 'Tue', count: 24.5 },
    { day: 'Wed', count: 26.8 },
    { day: 'Thu', count: 23.4 },
    { day: 'Fri', count: 29.1 },
    { day: 'Sat', count: 15.6 },
    { day: 'Sun', count: 14.8 },
  ];

  const maxRequests = Math.max(...requestPoints.map((p) => p.count));

  const regions = [
    { name: 'US-East (N. Virginia)', latency: '8.4ms', traffic: '42%', status: 'Nominal' },
    { name: 'EU-Central (Frankfurt)', latency: '12.1ms', traffic: '28%', status: 'Nominal' },
    { name: 'AP-Southeast (Singapore)', latency: '16.7ms', traffic: '18%', status: 'Nominal' },
    { name: 'US-West (Oregon)', latency: '9.2ms', traffic: '12%', status: 'Nominal' },
  ];

  return (
    <div className="space-y-6">
      {/* Header and Timeframe Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#111827] dark:text-[#FAFAFA]">
            Platform Analytics & Telemetry
          </h1>
          <p className="text-xs text-[#64748B] dark:text-[#A1A1AA] mt-1">
            Real-time infrastructure throughput, financial run-rate, and regional traffic health.
          </p>
        </div>

        {/* Timeframe pill selector */}
        <div className="flex items-center p-1 bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] rounded-lg shadow-2xs self-start sm:self-auto">
          {(['7d', '30d', '90d', '1y'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                timeframe === t
                  ? 'bg-[#2563EB] dark:bg-[#3B82F6] text-white shadow-2xs'
                  : 'text-[#64748B] dark:text-[#A1A1AA] hover:text-[#111827] dark:hover:text-[#FAFAFA]'
              }`}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Primary Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Run-rate SVG Area chart */}
        <div className="p-5 rounded-xl bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs text-[#64748B] dark:text-[#A1A1AA]">Revenue Velocity</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-bold font-mono tracking-tight text-[#111827] dark:text-[#FAFAFA] tabular-nums">
                  $148,250
                </span>
                <span className="text-xs font-mono font-medium text-emerald-600 dark:text-emerald-400 flex items-center">
                  <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> +14.8%
                </span>
              </div>
            </div>
            <span className="text-[11px] font-mono text-[#64748B] dark:text-[#A1A1AA]">
              MRR Normalized
            </span>
          </div>

          {/* SVG Smooth Curve */}
          <div className="h-44 w-full pt-2">
            <svg viewBox="0 0 400 150" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="mrrGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Background grid lines */}
              <line x1="0" y1="30" x2="400" y2="30" stroke="currentColor" strokeOpacity="0.07" strokeDasharray="4 4" />
              <line x1="0" y1="80" x2="400" y2="80" stroke="currentColor" strokeOpacity="0.07" strokeDasharray="4 4" />
              <line x1="0" y1="130" x2="400" y2="130" stroke="currentColor" strokeOpacity="0.07" strokeDasharray="4 4" />

              {/* Area */}
              <polygon
                points="0,150 0,110 133,90 266,60 400,20 400,150"
                fill="url(#mrrGradient)"
              />
              {/* Line */}
              <polyline
                points="0,110 133,90 266,60 400,20"
                fill="none"
                stroke="#2563EB"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Dots */}
              <circle cx="0" cy="110" r="3.5" fill="#2563EB" className="dark:fill-[#3B82F6]" />
              <circle cx="133" cy="90" r="3.5" fill="#2563EB" className="dark:fill-[#3B82F6]" />
              <circle cx="266" cy="60" r="3.5" fill="#2563EB" className="dark:fill-[#3B82F6]" />
              <circle cx="400" cy="20" r="3.5" fill="#2563EB" className="dark:fill-[#3B82F6]" />
            </svg>
          </div>

          <div className="flex justify-between text-[11px] font-mono text-[#64748B] dark:text-[#A1A1AA] pt-3 border-t border-[#F1F5F9] dark:border-[#27272A]/80">
            <span>Oct 14</span>
            <span>Oct 21</span>
            <span>Oct 28</span>
            <span>Nov 04</span>
          </div>
        </div>

        {/* Daily API Ingress Volume Bar Chart */}
        <div className="p-5 rounded-xl bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs text-[#64748B] dark:text-[#A1A1AA]">Edge Request Volume</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-bold font-mono tracking-tight text-[#111827] dark:text-[#FAFAFA] tabular-nums">
                  152.4M
                </span>
                <span className="text-xs font-mono font-medium text-emerald-600 dark:text-emerald-400 flex items-center">
                  <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> +21.4%
                </span>
              </div>
            </div>
            <span className="text-[11px] font-mono text-[#64748B] dark:text-[#A1A1AA]">
              7-Day Peak: 29.1M
            </span>
          </div>

          {/* Bar Chart */}
          <div className="h-44 w-full flex items-end justify-between gap-3 pt-4">
            {requestPoints.map((item) => {
              const heightPercent = Math.round((item.count / maxRequests) * 100);
              return (
                <div key={item.day} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-mono text-[#111827] dark:text-[#FAFAFA] tabular-nums">
                    {item.count}M
                  </span>
                  <div className="w-full bg-[#F1F5F9] dark:bg-[#111114] rounded-t-sm h-32 flex items-end overflow-hidden">
                    <div
                      className="w-full bg-[#2563EB] dark:bg-[#3B82F6] hover:bg-[#1D4ED8] dark:hover:bg-[#60A5FA] rounded-t-sm transition-all duration-300"
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-mono text-[#64748B] dark:text-[#A1A1AA]">
                    {item.day}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#64748B] dark:text-[#A1A1AA] pt-3 border-t border-[#F1F5F9] dark:border-[#27272A]/80">
            <span>Average: 21.7M / day</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">99.99% Edge Cache Hit</span>
          </div>
        </div>
      </div>

      {/* Regional Edge Health Table */}
      <div className="rounded-xl bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-[#E5E7EB] dark:border-[#27272A] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h3 className="text-sm font-bold text-[#111827] dark:text-[#FAFAFA]">
              Edge PoP Zones & Regional Latency
            </h3>
          </div>
          <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" /> All 18 Zones Active
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#E5E7EB] dark:border-[#27272A] bg-[#F8FAFC] dark:bg-[#111114] text-[11px] font-semibold text-[#64748B] dark:text-[#A1A1AA] uppercase tracking-wider">
                <th className="py-2.5 px-4">Region Name</th>
                <th className="py-2.5 px-4">P95 Latency</th>
                <th className="py-2.5 px-4">Traffic Share</th>
                <th className="py-2.5 px-4">Health Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] dark:divide-[#27272A]">
              {regions.map((reg) => (
                <tr key={reg.name} className="hover:bg-[#F8FAFC] dark:hover:bg-[#111114] transition-colors">
                  <td className="py-3 px-4 font-semibold text-[#111827] dark:text-[#FAFAFA]">
                    {reg.name}
                  </td>
                  <td className="py-3 px-4 font-mono tabular-nums text-[#111827] dark:text-[#FAFAFA]">
                    {reg.latency}
                  </td>
                  <td className="py-3 px-4 font-mono tabular-nums text-[#64748B] dark:text-[#A1A1AA]">
                    {reg.traffic}
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40 font-medium">
                      {reg.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
