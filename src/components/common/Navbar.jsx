import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { ChevronDown, Menu, X, ArrowRight, Calculator, Phone } from 'lucide-react';
import { LOAN_TYPES } from '../../constants';
import logo from '../../assets/logo.png';

const loanLinks = LOAN_TYPES.map(l => ({ to: `/loans/${l.value}`, label: l.label }));

const calcLinks = [
  { to: '/emi-calculator', label: 'EMI Calculator', desc: 'Calculate monthly payments' },
  { to: '/eligibility', label: 'Eligibility Check', desc: 'Check your loan eligibility' },
];

const navLinks = [
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

function Logo() {
  return (
    <Link to="/" className="flex h-12 w-36 flex-shrink-0 items-center sm:w-44">
      <img src={logo} alt="GoodDebt" className="h-full w-full object-contain object-left" />
    </Link>
  );
}

function DropdownMenu({ items, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.97 }}
      transition={{ duration: 0.18, ease: [0.34, 1.56, 0.64, 1] }}
      className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-neutral-200 overflow-hidden z-50"
    >
      <div className="p-2">
        {items.map(item => (
          <Link key={item.to} to={item.to} onClick={onClose}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-neutral-700 hover:bg-brand-50 hover:text-brand-700 font-medium transition-colors group"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-300 group-hover:bg-brand-500 transition-colors flex-shrink-0" />
            {item.label}
          </Link>
        ))}
      </div>
    </motion.div>
  );
}

function CalcDropdown({ items, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.97 }}
      transition={{ duration: 0.18, ease: [0.34, 1.56, 0.64, 1] }}
      className="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-neutral-200 overflow-hidden z-50"
    >
      <div className="p-2">
        {items.map(item => (
          <Link key={item.to} to={item.to} onClick={onClose}
            className="flex items-start gap-3 px-3 py-3 rounded-xl hover:bg-brand-50 transition-colors group"
          >
            <div className="w-8 h-8 bg-brand-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-brand-200 transition-colors mt-0.5">
              <Calculator className="w-4 h-4 text-brand-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-800 group-hover:text-brand-700">{item.label}</p>
              <p className="text-xs text-neutral-500 mt-0.5">{item.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loansOpen, setLoansOpen] = useState(false);
  const [calcOpen, setCalcOpen] = useState(false);
  const loansRef = useRef(null);
  const calcRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 24));

  // Close dropdowns on route change
  useEffect(() => {
    setMobileOpen(false);
    setLoansOpen(false);
    setCalcOpen(false);
  }, [location.pathname]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (loansRef.current && !loansRef.current.contains(e.target)) setLoansOpen(false);
      if (calcRef.current && !calcRef.current.contains(e.target)) setCalcOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <>
      <motion.header
        animate={scrolled ? {
          backgroundColor: 'rgba(255,255,255,0.97)',
          boxShadow: '0 2px 20px -4px rgba(0,0,0,0.08)',
          backdropFilter: 'blur(20px)',
        } : {
          backgroundColor: 'rgba(255,255,255,0)',
          boxShadow: 'none',
          backdropFilter: 'blur(0px)',
        }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 right-0 z-40"
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">
            <Logo />

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {/* Loans dropdown */}
              <div ref={loansRef} className="relative">
                <button
                  onMouseEnter={() => setLoansOpen(true)}
                  onMouseLeave={() => setLoansOpen(false)}
                  onClick={() => setLoansOpen(v => !v)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${loansOpen ? 'text-brand-600 bg-brand-50' : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'}`}
                >
                  Loans
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${loansOpen ? 'rotate-180 text-brand-600' : ''}`} />
                </button>
                <AnimatePresence>
                  {loansOpen && (
                    <div onMouseEnter={() => setLoansOpen(true)} onMouseLeave={() => setLoansOpen(false)}>
                      <DropdownMenu items={loanLinks} onClose={() => setLoansOpen(false)} />
                    </div>
                  )}
                </AnimatePresence>
              </div>

              {/* Calculators dropdown */}
              <div ref={calcRef} className="relative">
                <button
                  onMouseEnter={() => setCalcOpen(true)}
                  onMouseLeave={() => setCalcOpen(false)}
                  onClick={() => setCalcOpen(v => !v)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${calcOpen ? 'text-brand-600 bg-brand-50' : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'}`}
                >
                  Calculators
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${calcOpen ? 'rotate-180 text-brand-600' : ''}`} />
                </button>
                <AnimatePresence>
                  {calcOpen && (
                    <div onMouseEnter={() => setCalcOpen(true)} onMouseLeave={() => setCalcOpen(false)}>
                      <CalcDropdown items={calcLinks} onClose={() => setCalcOpen(false)} />
                    </div>
                  )}
                </AnimatePresence>
              </div>

              {navLinks.map(item => (
                <NavLink key={item.to} to={item.to}
                  className={({ isActive }) =>
                    `px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${isActive ? 'text-brand-600 bg-brand-50' : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'}`
                  }
                >{item.label}</NavLink>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-3">
              <a href="tel:+919999999999"
                className="flex items-center gap-1.5 text-sm font-medium text-neutral-600 hover:text-brand-600 transition-colors px-2 py-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span className="hidden xl:inline">+91 99999 99999</span>
              </a>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/eligibility')}
                className="flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white text-sm font-semibold rounded-xl shadow-brand-sm hover:bg-brand-700 transition-all duration-200"
              >
                Check Eligibility
                <ArrowRight className="w-3.5 h-3.5" />
              </motion.button>
            </div>

            {/* Mobile hamburger */}
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => setMobileOpen(v => !v)}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl text-neutral-700 hover:bg-neutral-100 transition-colors"
            >
              <AnimatePresence mode="wait">
                {mobileOpen
                  ? <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}><X className="w-5 h-5" /></motion.div>
                  : <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}><Menu className="w-5 h-5" /></motion.div>
                }
              </AnimatePresence>
            </motion.button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              className="lg:hidden bg-white border-t border-neutral-100 overflow-hidden shadow-lg"
            >
              <div className="px-4 py-5 space-y-1 max-h-[80vh] overflow-y-auto">
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest px-3 pb-2">Loan Products</p>
                <div className="grid grid-cols-2 gap-1">
                  {loanLinks.map(l => (
                    <Link key={l.to} to={l.to} onClick={() => setMobileOpen(false)}
                      className="px-3 py-2.5 rounded-xl text-sm text-neutral-700 hover:bg-brand-50 hover:text-brand-700 font-medium transition-colors"
                    >{l.label}</Link>
                  ))}
                </div>

                <div className="border-t border-neutral-100 my-3" />
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest px-3 pb-2">Tools</p>
                {calcLinks.map(l => (
                  <Link key={l.to} to={l.to} onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-neutral-700 hover:bg-neutral-50 font-medium transition-colors"
                  >
                    <Calculator className="w-4 h-4 text-brand-500" />
                    {l.label}
                  </Link>
                ))}

                <div className="border-t border-neutral-100 my-3" />
                {navLinks.map(item => (
                  <Link key={item.to} to={item.to} onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2.5 rounded-xl text-sm text-neutral-700 hover:bg-neutral-50 font-medium transition-colors"
                  >{item.label}</Link>
                ))}

                <div className="pt-3 space-y-2">
                  <Link to="/eligibility" onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-2 w-full px-5 py-3.5 bg-brand-600 text-white text-sm font-semibold rounded-2xl hover:bg-brand-700 transition-colors shadow-brand-sm"
                  >
                    Check Eligibility <ArrowRight className="w-4 h-4" />
                  </Link>
                  <a href="tel:+919999999999"
                    className="flex items-center justify-center gap-2 w-full px-5 py-3.5 bg-neutral-100 text-neutral-700 text-sm font-semibold rounded-2xl hover:bg-neutral-200 transition-colors"
                  >
                    <Phone className="w-4 h-4" /> Call Us
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Mobile sticky bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-30 lg:hidden">
        <div className="bg-white border-t border-neutral-200 px-4 py-3 flex gap-3 shadow-2xl">
          <a href="tel:+919999999999"
            className="flex items-center justify-center gap-2 flex-1 py-3 bg-neutral-100 text-neutral-700 text-sm font-semibold rounded-xl hover:bg-neutral-200 transition-colors"
          >
            <Phone className="w-4 h-4" /> Call
          </a>
          <Link to="/eligibility"
            className="flex items-center justify-center gap-2 flex-[2] py-3 bg-brand-600 text-white text-sm font-semibold rounded-xl hover:bg-brand-700 transition-colors shadow-brand-sm"
          >
            Check Eligibility <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </>
  );
}
