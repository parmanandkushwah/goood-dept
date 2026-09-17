export default function Badge({ children, color = 'gray', className = '' }) {
  const colors = {
    brand: 'bg-brand-100 text-brand-700',
    gray: 'bg-neutral-100 text-neutral-600',
    blue: 'bg-sky-100 text-sky-700',
    green: 'bg-green-100 text-green-700',
    red: 'bg-brand-100 text-brand-700',
    yellow: 'bg-amber-100 text-amber-700',
    orange: 'bg-orange-100 text-orange-700',
    purple: 'bg-violet-100 text-violet-700',
    indigo: 'bg-indigo-100 text-indigo-700',
    teal: 'bg-teal-100 text-teal-700',
    emerald: 'bg-emerald-100 text-emerald-700',
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${colors[color] || colors.gray} ${className}`}>{children}</span>
  );
}
