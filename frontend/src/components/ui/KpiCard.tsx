import clsx from 'clsx';
import { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: 'blue' | 'red' | 'green' | 'yellow' | 'orange';
  subtitle?: string;
  trend?: { value: number; label: string };
}

const colorMap = {
  blue: { bg: 'bg-blue-50', icon: 'bg-blue-100 text-blue-700', text: 'text-blue-700' },
  red: { bg: 'bg-red-50', icon: 'bg-red-100 text-red-700', text: 'text-red-700' },
  green: { bg: 'bg-green-50', icon: 'bg-green-100 text-green-700', text: 'text-green-700' },
  yellow: { bg: 'bg-yellow-50', icon: 'bg-yellow-100 text-yellow-700', text: 'text-yellow-700' },
  orange: { bg: 'bg-orange-50', icon: 'bg-orange-100 text-orange-700', text: 'text-orange-700' },
};

export default function KpiCard({ title, value, icon: Icon, color, subtitle, trend }: KpiCardProps) {
  const colors = colorMap[color];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className={clsx('text-3xl font-bold mt-1', colors.text)}>{value}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        </div>
        <div className={clsx('w-12 h-12 rounded-xl flex items-center justify-center', colors.icon)}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      {trend && (
        <div className="mt-3 pt-3 border-t border-gray-50">
          <span className={clsx('text-xs font-medium', trend.value >= 0 ? 'text-green-600' : 'text-red-600')}>
            {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
          <span className="text-xs text-gray-400 ml-1">{trend.label}</span>
        </div>
      )}
    </div>
  );
}
