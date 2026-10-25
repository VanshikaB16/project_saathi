import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: 'navy' | 'teal' | 'amber' | 'green' | 'red';
  badge?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'navy',
  badge,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'teal':
        return {
          iconBg: 'bg-saathi-paleMint text-saathi-teal',
          border: 'border-saathi-teal/30',
          accent: 'text-saathi-teal',
        };
      case 'amber':
        return {
          iconBg: 'bg-amber-100 text-saathi-amber',
          border: 'border-amber-300',
          accent: 'text-saathi-amber',
        };
      case 'green':
        return {
          iconBg: 'bg-emerald-100 text-saathi-success',
          border: 'border-emerald-300',
          accent: 'text-saathi-success',
        };
      case 'red':
        return {
          iconBg: 'bg-red-100 text-saathi-red',
          border: 'border-red-300',
          accent: 'text-saathi-red',
        };
      default:
        return {
          iconBg: 'bg-slate-100 text-saathi-navy',
          border: 'border-saathi-border',
          accent: 'text-saathi-navy',
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className={`bg-white rounded-2xl p-5 border ${styles.border} shadow-sm hover:shadow-md transition-saathi`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-saathi-textSecondary uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl md:text-3xl font-extrabold text-saathi-navy mt-1">{value}</h3>
          {subtitle && <p className="text-xs text-saathi-textMuted mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-xl ${styles.iconBg}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      {badge && (
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
          <span className="font-semibold text-saathi-textSecondary">{badge}</span>
        </div>
      )}
    </div>
  );
};
