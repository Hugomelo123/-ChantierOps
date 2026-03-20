import clsx from 'clsx';

interface BadgeProps {
  variant: 'ok' | 'alerte' | 'partiel' | 'normal' | 'urgent' | 'critique' | 'default';
  children: React.ReactNode;
  className?: string;
}

const variants = {
  ok: 'bg-green-100 text-green-800 border border-green-200',
  alerte: 'bg-red-100 text-red-800 border border-red-200',
  partiel: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
  normal: 'bg-green-100 text-green-800',
  urgent: 'bg-orange-100 text-orange-800',
  critique: 'bg-red-100 text-red-800',
  default: 'bg-gray-100 text-gray-700',
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
