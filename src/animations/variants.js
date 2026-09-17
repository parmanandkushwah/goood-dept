// ── Easing presets ──────────────────────────────────────────────
export const ease = {
  out:    [0.0, 0.0, 0.2, 1.0],
  in:     [0.4, 0.0, 1.0, 1.0],
  inOut:  [0.4, 0.0, 0.2, 1.0],
  spring: [0.34, 1.56, 0.64, 1],
  smooth: [0.25, 0.46, 0.45, 0.94],
};

// ── Viewport config ──────────────────────────────────────────────
export const viewportConfig = { once: true, margin: '-60px' };
export const viewportEager  = { once: true, margin: '-20px' };

// ── Fade variants ────────────────────────────────────────────────
export const fadeIn = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, ease: ease.out } },
};

export const fadeInUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: ease.smooth } },
};

export const fadeInDown = {
  hidden:  { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: ease.out } },
};

export const fadeInLeft = {
  hidden:  { opacity: 0, x: -32 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: ease.smooth } },
};

export const fadeInRight = {
  hidden:  { opacity: 0, x: 32 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: ease.smooth } },
};

// ── Scale variants ───────────────────────────────────────────────
export const scaleIn = {
  hidden:  { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: ease.spring } },
};

export const scaleInFast = {
  hidden:  { opacity: 0, scale: 0.88 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: ease.spring } },
};

// ── Stagger containers ───────────────────────────────────────────
export const staggerContainer = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

export const staggerFast = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.05 } },
};

export const staggerSlow = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
};

// ── Slide variants ───────────────────────────────────────────────
export const slideInLeft = {
  hidden:  { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.55, ease: ease.smooth } },
};

export const slideInRight = {
  hidden:  { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.55, ease: ease.smooth } },
};

// ── Form step transitions ────────────────────────────────────────
export const formStepVariants = {
  enter:  (dir) => ({ x: dir > 0 ? 56 : -56, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.28, ease: ease.smooth } },
  exit:   (dir) => ({ x: dir < 0 ? 56 : -56, opacity: 0, transition: { duration: 0.2, ease: ease.in } }),
};

// ── Card hover ───────────────────────────────────────────────────
export const cardHover = {
  rest:  { y: 0, transition: { duration: 0.2, ease: ease.out } },
  hover: { y: -4, transition: { duration: 0.2, ease: ease.out } },
};

// ── Navbar ───────────────────────────────────────────────────────
export const navbarVariants = {
  top:      { backgroundColor: 'rgba(255,255,255,0)', boxShadow: 'none' },
  scrolled: { backgroundColor: 'rgba(255,255,255,0.97)', boxShadow: '0 2px 20px -4px rgba(0,0,0,0.08)' },
};

export const dropdownVariants = {
  hidden:  { opacity: 0, y: 8, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.18, ease: ease.spring } },
  exit:    { opacity: 0, y: 6, scale: 0.97, transition: { duration: 0.12 } },
};

// ── Modal ────────────────────────────────────────────────────────
export const modalOverlay = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit:    { opacity: 0, transition: { duration: 0.15 } },
};

export const modalContent = {
  hidden:  { opacity: 0, scale: 0.94, y: 16 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3, ease: ease.spring } },
  exit:    { opacity: 0, scale: 0.96, y: 8, transition: { duration: 0.2 } },
};

// ── Accordion ────────────────────────────────────────────────────
export const accordionContent = {
  hidden:  { height: 0, opacity: 0 },
  visible: { height: 'auto', opacity: 1, transition: { duration: 0.3, ease: ease.smooth } },
  exit:    { height: 0, opacity: 0, transition: { duration: 0.22, ease: ease.in } },
};

// ── Success animation ────────────────────────────────────────────
export const successVariants = {
  hidden:  { scale: 0, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 200, damping: 15, delay: 0.1 } },
};

// ── Float animations (for hero elements) ────────────────────────
export const floatAnimation = (delay = 0, amplitude = 10) => ({
  animate: {
    y: [0, -amplitude, 0],
    transition: { duration: 4 + delay, repeat: Infinity, ease: 'easeInOut', delay },
  },
});

// ── Number counter ───────────────────────────────────────────────
export const numberVariants = {
  hidden:  { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: ease.spring } },
};

// ── Page transition ──────────────────────────────────────────────
export const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: ease.smooth } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.2 } },
};
