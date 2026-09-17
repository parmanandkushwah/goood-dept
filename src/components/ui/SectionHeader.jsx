import { motion } from 'framer-motion';
import { fadeInUp, viewportConfig } from '../../animations/variants';

export default function SectionHeader({ badge, title, subtitle, center = true, align, className = 'mb-12' }) {
  return (
    <motion.div
      variants={fadeInUp} initial="hidden" whileInView="visible" viewport={viewportConfig}
      className={`${className} ${center ? 'text-center' : align === 'left' ? 'text-left' : 'text-left'}`}
    >
      {badge && (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 mb-4 border border-brand-100">
          {badge}
        </span>
      )}
      <h2 className="heading-md text-center">{title}</h2>
      {subtitle && <p className={`text-neutral-500 mt-2 ${center ? 'mx-auto max-w-lg' : ''}`}>{subtitle}</p>}
    </motion.div>
  );
}
