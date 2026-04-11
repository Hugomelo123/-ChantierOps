import clsx from 'clsx';

interface BadgeProps {
  variant: 'ok' | 'alerte' | 'partiel' | 'normal' | 'urgent' | 'critique' | 'default';
  children: React.ReactNode;
  className?: string;
}

const variants = {
  ok:       'bg-green-500/15 text-green-400 border border-green-500/20',
  alerte:   'bg-red-500/15 text-red-400 border border-red-500/20',
  partiel:  'bg-yellow-500/15 text-yellow-400 border border-yellow-500/20',
  normal:   'bg-green-500/15 text-green-400',
  urgent:   'bg-orange-500/15 text-orange-400',
  critique: 'bg-red-500/15 text-red-400',
  default:  'bg-white/10 text-slate-300',
};

export default function Badge({ variant, children, className }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
