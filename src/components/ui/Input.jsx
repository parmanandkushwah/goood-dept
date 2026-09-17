import { forwardRef } from 'react';

const Input = forwardRef(({ label, error, hint, className = '', ...props }, ref) => (
  <div className="w-full">
    {label && <label className="label">{label}</label>}
    <input ref={ref} className={`input-field ${error ? 'border-error focus:ring-error/30 focus:border-error' : ''} ${className}`} {...props} />
    {error && <p className="mt-1 text-xs text-brand-500">{error}</p>}
    {hint && !error && <p className="mt-1 text-xs text-neutral-400">{hint}</p>}
  </div>
));
Input.displayName = 'Input';
export default Input;
