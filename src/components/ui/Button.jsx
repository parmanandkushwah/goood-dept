import { motion } from 'framer-motion';

export default function Button({ children, variant = 'primary', size = 'md', loading, className = '', ...props }) {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800 shadow-brand-sm hover:shadow-brand',
    secondary: 'bg-white text-brand-600 border-2 border-brand-200 hover:border-brand-400 hover:bg-brand-50',
    ghost: 'text-neutral-600 hover:bg-neutral-100',
    danger: 'bg-brand-600 text-white hover:bg-brand-700',
  };
  const sizes = { sm: 'px-4 py-2 text-sm', md: 'px-6 py-3 text-sm', lg: 'px-8 py-4 text-base' };
  return (
    <motion.button whileTap={{ scale: 0.97 }} className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} disabled={loading || props.disabled} {...props}>
      {loading && <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
      {children}
    </motion.button>
  );
}
