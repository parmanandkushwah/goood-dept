import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight, Shield, Clock, Users, Star, ChevronDown, Phone, X,
  Wallet, TrendingUp, Lock, Zap, Landmark, FileCheck, Headphones, ArrowUpRight,
  Briefcase, Home as HomeIcon, Car, GraduationCap, Gem, RefreshCw, CreditCard,
  Carrot, Play
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { faqsApi, testimonialsApi } from '../api';
import { LOAN_TYPES } from '../constants';
import { fadeInUp, staggerContainer, viewportConfig, scaleIn } from '../animations/variants';
import SectionHeader from '../components/ui/SectionHeader';
import MultiStepForm from '../components/forms/MultiStepForm';
import EMICalculatorWidget from '../components/common/EMICalculatorWidget';
import heroImage from '../assets/hero1.png';

const loanIcons = {
  'personal-loan': Wallet,
  'business-loan': Briefcase,
  'home-loan': HomeIcon,
  'loan-against-property': Landmark,
  'car-loan': Car,
  'education-loan': GraduationCap,
  'gold-loan': Gem,
  'debt-consolidation': RefreshCw,
};

const loanColors = {
  'personal-loan': 'bg-brand-50 text-brand-600',
  'business-loan': 'bg-emerald-50 text-emerald-600',
  'home-loan': 'bg-violet-50 text-violet-600',
  'loan-against-property': 'bg-orange-50 text-orange-600',
  'car-loan': 'bg-rose-50 text-rose-600',
  'education-loan': 'bg-teal-50 text-teal-600',
  'gold-loan': 'bg-amber-50 text-amber-600',
  'debt-consolidation': 'bg-indigo-50 text-indigo-600',
};

const loanGradients = {
  'personal-loan': 'from-brand-500/10 to-brand-600/5',
  'business-loan': 'from-emerald-500/10 to-emerald-600/5',
  'home-loan': 'from-violet-500/10 to-violet-600/5',
  'loan-against-property': 'from-orange-500/10 to-orange-600/5',
  'car-loan': 'from-rose-500/10 to-rose-600/5',
  'education-loan': 'from-teal-500/10 to-teal-600/5',
  'gold-loan': 'from-amber-500/10 to-amber-600/5',
  'debt-consolidation': 'from-indigo-500/10 to-indigo-600/5',
};

const howItWorksSteps = [
  {
    step: '01',
    title: 'Eligibility',
    desc: 'Tell us your loan requirement and basic details in minutes.',
    icon: Users,
    marker: { left: '23.4464%', top: 55 },
    content: { x: 28, y: 110, width: 220 },
    align: 'text-right',
    numberAlign: 'justify-end',
  },
  {
    step: '02',
    title: 'Compare',
    desc: 'We match your profile with suitable loan options.',
    icon: TrendingUp,
    marker: { left: '73.7857%', top: 160 },
    content: { x: 930, y: 204, width: 210 },
    align: 'text-left',
    numberAlign: 'justify-start',
  },
  {
    step: '03',
    title: 'Apply',
    desc: 'Complete your digital application with guided support.',
    icon: FileCheck,
    marker: { left: '21.68%', top: 330 },
    content: { x: 26, y: 386, width: 220 },
    align: 'text-right',
    numberAlign: 'justify-end',
  },
  {
    step: '04',
    title: 'Disbursement',
    desc: 'Get quick updates as your loan moves to sanction and disbursal.',
    icon: Landmark,
    marker: { left: '73.7857%', top: 415 },
    content: { x: 930, y: 422, width: 210 },
    align: 'text-left',
    numberAlign: 'justify-start',
  },
];

export default function Home() {
  const [formOpen, setFormOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const navigate = useNavigate();

  const { data: faqData } = useQuery({ queryKey: ['faqs-public'], queryFn: () => faqsApi.getAll({ published: 'true' }), staleTime: 300000 });
  const { data: testimonialData } = useQuery({ queryKey: ['testimonials-public'], queryFn: () => testimonialsApi.getAll({ published: 'true' }), staleTime: 300000 });

  const faqs = faqData?.data?.data || [];
  const testimonials = testimonialData?.data?.data || [];

  const autoNext = useCallback(() => {
    if (testimonials.length > 1) {
      setTestimonialIdx(i => (i + 1) % Math.min(testimonials.length, 3));
    }
  }, [testimonials.length]);

  return (
    <div className="overflow-x-hidden">
      {/* ═══════ HERO ═══════ */}
      <section className="relative flex items-start bg-white overflow-hidden pt-16 lg:min-h-screen lg:items-center">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${heroImage})`,
            opacity: 0.12,
            backgroundSize: 'cover',
          }}
        />
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 75% 30%, rgba(158,30,39,0.08) 0%, transparent 50%)' }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 20% 80%, rgba(158,30,39,0.04) 0%, transparent 40%)' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10 lg:pt-6 lg:pb-20 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-brand-50 border border-brand-100 rounded-full text-brand-700 text-xs font-semibold mb-6"
            >
              <Zap className="w-3.5 h-3.5" /> SMARTER BORROWING STARTS HERE
            </motion.div>

            <h1 className="text-[2rem] sm:text-[2.75rem] lg:text-[3.5rem] xl:text-[4rem] font-display font-extrabold text-neutral-900 leading-[1.1] mb-6">
              Find the Right{' '}
              <span className="text-brand-600">Loan</span> for Your{' '}
              <span className="text-brand-600">Financial Goals</span>
            </h1>

            <p className="text-base lg:text-lg text-neutral-500 leading-relaxed mb-8 max-w-lg">
              Compare your options, understand your eligibility and get expert assistance through a simple digital process.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => setFormOpen(true)}
                className="flex items-center justify-center gap-2 px-7 py-3.5 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 shadow-brand-sm transition-all duration-200 hover:-translate-y-px text-sm"
              >
                Check Your Eligibility <ArrowRight className="w-4 h-4" />
              </motion.button>
              <Link
                to="/loans"
                className="flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-neutral-700 font-semibold rounded-xl border border-neutral-200 hover:border-brand-300 hover:text-brand-600 transition-all duration-200 text-sm"
              >
                Explore Loan Options <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-6 mt-10">
              {[
                { icon: Shield, text: 'Secure & Confidential' },
                { icon: Clock, text: 'Quick Response' },
                { icon: Users, text: 'Expert Guidance' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-neutral-500 text-sm">
                  <Icon className="w-4 h-4 text-brand-500" /> {text}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right - Dashboard Visual */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden lg:block relative"
          >
            <div className="relative">
              {/* Main Card */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="bg-white rounded-2xl border border-neutral-200 shadow-float p-6"
              >
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-neutral-400 text-xs font-medium uppercase tracking-wider">Loan Enquiry</p>
                    <p className="text-neutral-900 font-display font-bold text-xl mt-1">GD-2026-000123</p>
                  </div>
                  <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full border border-green-100 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full" /> Active
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Loan Type', value: 'Personal Loan', highlight: true },
                    { label: 'Amount', value: '₹5,00,000', highlight: true },
                    { label: 'Interest Rate', value: '12% p.a.', highlight: false },
                    { label: 'Status', value: 'Under Review', highlight: false },
                  ].map(item => (
                    <div key={item.label} className="bg-neutral-50 rounded-xl px-4 py-3">
                      <p className="text-neutral-400 text-xs mb-1">{item.label}</p>
                      <p className={`font-semibold ${item.highlight ? 'text-brand-600' : 'text-neutral-900'}`}>{item.value}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Floating EMI Card */}
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="absolute -bottom-6 -left-8 bg-white rounded-2xl shadow-xl border border-neutral-100 p-4 w-52"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 bg-brand-50 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-brand-600" />
                  </div>
                  <div>
                    <p className="text-xs text-neutral-400">Monthly EMI</p>
                    <p className="text-lg font-display font-bold text-neutral-900">₹34,470</p>
                  </div>
                </div>
                <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-500 rounded-full w-[65%]" />
                </div>
                <p className="text-[10px] text-neutral-400 mt-1.5">65% complete</p>
              </motion.div>

              {/* Floating Trust Card */}
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg border border-neutral-100 p-3 flex items-center gap-2.5"
              >
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <FileCheck className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-neutral-900">Eligibility Verified</p>
                  <p className="text-[10px] text-neutral-400">High chance of approval</p>
                </div>
              </motion.div>

              {/* Floating Small Card */}
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
                className="absolute top-1/2 -right-8 bg-white/90 backdrop-blur rounded-xl shadow-lg border border-neutral-100 p-3"
              >
                <div className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-brand-500" />
                  <span className="text-[11px] font-medium text-neutral-600">Secure & Private</span>
                </div>
              </motion.div>

              {/* Decorative elements */}
              <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-brand-50 rounded-full blur-2xl opacity-60" />
              <div className="absolute -top-8 -left-8 w-32 h-32 bg-brand-50 rounded-full blur-2xl opacity-40" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════ TRUST STRIP ═══════ */}
      <section className="bg-white border-y border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 lg:py-6">
          <div className="text-center mb-4">
            <p className="text-sm font-semibold text-neutral-500 uppercase tracking-wider">Your financial journey, made simpler</p>
          </div>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-6"
          >
            {[
              { icon: Lock, label: 'Secure Enquiries' },
              { icon: Headphones, label: 'Expert Assistance' },
              { icon: CreditCard, label: 'Multiple Loan Options' },
              { icon: Zap, label: 'Simple Process' },
              { icon: Shield, label: 'Transparent Communication' },
            ].map(({ icon: Icon, label }) => (
              <motion.div key={label} variants={fadeInUp} className="flex items-center justify-center gap-2 sm:gap-2.5">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-brand-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-600" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-neutral-700 leading-snug">{label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════ LOAN PRODUCTS ═══════ */}
      <section className="py-12 lg:py-16 bg-neutral-50">
        <div className="container-xl">
          <SectionHeader
            badge="Loan Products"
            title="Explore Our Loan Solutions"
            subtitle="Choose from a range of loan products and get expert assistance for your specific requirement."
            className="mb-8 lg:mb-10"
          />
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5"
          >
            {LOAN_TYPES.map(loan => {
              const IconComponent = loanIcons[loan.value];
              return (
                <motion.div
                  key={loan.value}
                  variants={fadeInUp}
                  whileHover={{ y: -6 }}
                  onClick={() => navigate(`/loans/${loan.value}`)}
                  className={`group relative bg-white rounded-2xl border border-neutral-200 p-4 sm:p-6 cursor-pointer transition-all duration-300 hover:shadow-card-hover hover:border-brand-200 overflow-hidden`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${loanGradients[loan.value]} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  <div className="relative">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 ${loanColors[loan.value]} group-hover:scale-110 transition-transform duration-300`}>
                      {IconComponent && <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />}
                    </div>
                    <h3 className="font-display font-bold text-neutral-900 mb-1.5 sm:mb-2 text-[13px] sm:text-[15px] leading-snug">{loan.label}</h3>
                    <p className="text-xs sm:text-sm text-neutral-500 mb-3 sm:mb-4 leading-relaxed line-clamp-2 sm:line-clamp-none">{loan.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] sm:text-xs font-semibold text-brand-600 bg-brand-50 px-2 py-1 sm:px-2.5 rounded-full leading-none">{loan.benefit}</span>
                      <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-300 group-hover:text-brand-500 group-hover:translate-x-1 transition-all duration-200" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ═══════ HOW IT WORKS ═══════ */}
      <section className="py-12 lg:py-16 bg-white overflow-hidden">
        <div className="container-xl">
          <SectionHeader
            badge="Process"
            title="How It Works"
            subtitle="Simple steps to get loan assistance"
            className="mb-8 lg:mb-10"
          />
          <div className="relative">
            <div className="rounded-[2rem] bg-neutral-50/70 px-3 py-6 sm:px-6 lg:hidden">
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={viewportConfig}
                className="grid grid-cols-2 gap-3 sm:gap-5"
              >
                {howItWorksSteps.map((item) => (
                  <motion.div
                    key={item.step}
                    variants={scaleIn}
                    className="relative flex min-h-[178px] flex-col rounded-2xl border border-neutral-200 bg-white p-4 shadow-card sm:min-h-[172px] sm:flex-row sm:gap-4 sm:p-5"
                  >
                    <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-900 shadow-xl ring-4 ring-brand-50 sm:h-14 sm:w-14">
                      <item.icon className="h-5 w-5 text-brand-300 sm:h-6 sm:w-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex items-end gap-1.5 sm:mb-3 sm:gap-2">
                        <span className="font-display text-2xl font-extrabold leading-none text-neutral-900 sm:text-4xl">{item.step}</span>
                        <span className="font-display text-3xl font-extrabold leading-none text-brand-100 sm:text-5xl">{item.step}</span>
                      </div>
                      <h3 className="mb-1.5 font-display text-sm font-bold text-neutral-900 sm:mb-2 sm:text-lg">{item.title}</h3>
                      <p className="text-xs leading-relaxed text-neutral-500 sm:text-sm">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewportConfig}
              className="relative mx-auto hidden h-[610px] max-w-[1120px] lg:block"
            >
              <div
                className="absolute inset-x-0 top-0 h-[540px] rounded-[2rem] opacity-60"
                style={{
                  backgroundImage: 'radial-gradient(circle, rgba(158,30,39,0.08) 1px, transparent 1px)',
                  backgroundSize: '24px 24px',
                }}
              />
              <div className="absolute left-1/2 top-[45%] -translate-x-1/2 -translate-y-1/2 select-none text-center font-display text-[7rem] font-extrabold leading-[0.9] text-neutral-900/[0.035] xl:text-[8.5rem]">
                good<br />debt
              </div>

              <svg viewBox="0 0 1120 540" className="absolute inset-x-0 top-0 h-[540px] w-full" aria-hidden="true">
                <defs>
                  <linearGradient id="processPathGradient" x1="260" y1="82" x2="860" y2="448" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#D9606B" />
                    <stop offset="48%" stopColor="#9E1E27" />
                    <stop offset="100%" stopColor="#621319" />
                  </linearGradient>
                  <filter id="processPathShadow" x="-5%" y="-15%" width="110%" height="130%">
                    <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#9E1E27" floodOpacity="0.12" />
                  </filter>
                </defs>
                <path
                  d="M 285 82 H 735 C 814 82 860 125 860 184 C 860 243 814 280 735 280 H 350 C 296 280 265 309 265 360 C 265 414 311 448 384 448 H 860"
                  fill="none"
                  stroke="#FBECEE"
                  strokeWidth="10"
                  strokeLinecap="round"
                  filter="url(#processPathShadow)"
                />
                <motion.path
                  d="M 285 82 H 735 C 814 82 860 125 860 184 C 860 243 814 280 735 280 H 350 C 296 280 265 309 265 360 C 265 414 311 448 384 448 H 860"
                  fill="none"
                  stroke="url(#processPathGradient)"
                  strokeWidth="5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={viewportConfig}
                  transition={{ duration: 1.2, ease: 'easeInOut' }}
                />
              </svg>

              {howItWorksSteps.map((item) => (
                <motion.div
                  key={`${item.step}-marker`}
                  variants={scaleIn}
                  className="absolute z-20 flex h-14 w-14 items-center justify-center rounded-full bg-neutral-900 shadow-xl ring-[5px] ring-white"
                  style={{
                    left: item.marker.left,
                    top: `${item.marker.top}px`,
                  }}
                >
                  <item.icon className="h-6 w-6 text-brand-300" />
                </motion.div>
              ))}

              {howItWorksSteps.map((item) => (
                <motion.div
                  key={`${item.step}-content`}
                  variants={scaleIn}
                  className={`absolute z-10 ${item.align}`}
                  style={{
                    left: `${(item.content.x / 1120) * 100}%`,
                    top: `${item.content.y}px`,
                    width: `${item.content.width}px`,
                  }}
                >
                  <div className={`mb-3 flex items-end gap-2 ${item.numberAlign}`}>
                    <span className="font-display text-4xl font-extrabold leading-none text-neutral-900">{item.step}</span>
                    <span className="font-display text-5xl font-extrabold leading-none text-brand-100/80">{item.step}</span>
                  </div>
                  <h3 className="mb-2 font-display text-lg font-bold text-neutral-900">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-neutral-500">{item.desc}</p>
                </motion.div>
              ))}

              <motion.button
                variants={fadeInUp}
                whileTap={{ scale: 0.97 }}
                onClick={() => setFormOpen(true)}
                className="btn-dark absolute bottom-5 left-1/2 z-20 -translate-x-1/2 px-9"
              >
                Get Started <ArrowRight className="w-4 h-4" />
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════ LEAD GEN CTA ═══════ */}
      <section className="py-10 lg:py-12 bg-neutral-50">
        <div className="container-lg">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            className="bg-white rounded-3xl p-8 lg:p-12 shadow-xl border border-neutral-100"
          >
            <div className="text-center mb-8">
              <h2 className="heading-lg mb-3">Let's Find the Right Loan for You</h2>
              <p className="text-neutral-500 max-w-lg mx-auto">Tell us a little about your requirement. It only takes a few minutes.</p>
            </div>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setFormOpen(true)}
              className="btn-primary-lg w-full sm:w-auto mx-auto flex"
            >
              Start Your Enquiry <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* ═══════ EMI CALCULATOR ═══════ */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="container-xl">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={viewportConfig}>
              <span className="eyebrow mb-4">EMI Calculator</span>
              <h2 className="heading-lg mb-4">Plan Your Loan Repayment</h2>
              <p className="body-md mb-6">Use our EMI calculator to estimate your monthly payments. Plan your finances before submitting your loan enquiry.</p>
              <Link to="/emi-calculator" className="inline-flex items-center gap-2 text-brand-600 font-semibold hover:text-brand-700 transition-colors text-sm">
                Open Full Calculator <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
            <motion.div variants={scaleIn} initial="hidden" whileInView="visible" viewport={viewportConfig}>
              <EMICalculatorWidget />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════ TESTIMONIALS ═══════ */}
      {testimonials.length > 0 && (
        <section className="py-12 lg:py-16 bg-neutral-50">
          <div className="container-xl">
            <SectionHeader
              badge="Testimonials"
              title="What Our Customers Say"
              subtitle="Hear from customers who have used our loan assistance service."
              className="mb-8 lg:mb-10"
            />
            <div className="overflow-hidden">
              <motion.div
                className="flex gap-6 transition-transform duration-500 ease-out"
                animate={{ x: `-${testimonialIdx * 100}%` }}
              >
                {testimonials.slice(0, 3).map((t) => (
                  <div key={t.id} className="w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] flex-shrink-0">
                    <div className="card h-full">
                      <div className="flex items-center gap-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < t.rating ? 'text-amber-400 fill-amber-400' : 'text-neutral-200'}`} />
                        ))}
                      </div>
                      <p className="text-neutral-600 text-sm leading-relaxed mb-5">"{t.review}"</p>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-brand-50 rounded-full flex items-center justify-center text-brand-700 font-bold text-sm">
                          {t.name?.[0]}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-neutral-900">{t.name}</p>
                          <p className="text-xs text-neutral-400">{t.location} · {t.loanType?.replace(/-/g, ' ')}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
              <div className="flex items-center justify-center gap-2 mt-6">
                {[0, 1, 2].map(i => (
                  <button
                    key={i}
                    onClick={() => setTestimonialIdx(i)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${testimonialIdx === i ? 'bg-brand-600 w-6' : 'bg-neutral-300'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══════ FAQ ═══════ */}
      {faqs.length > 0 && (
        <section className="py-12 lg:py-16 bg-white">
          <div className="container-md">
            <SectionHeader
              badge="FAQ"
              title="Frequently Asked Questions"
              subtitle="Answers to common questions about our loan assistance service."
              className="mb-8 lg:mb-10"
            />
            <div className="space-y-3">
              {faqs.slice(0, 6).map((faq, i) => (
                <motion.div
                  key={faq.id}
                  variants={fadeInUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewportConfig}
                  className="bg-white rounded-2xl border border-neutral-200 overflow-hidden transition-all duration-200 hover:shadow-md"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left gap-4"
                  >
                    <span className="font-medium text-neutral-900 text-sm">{faq.question}</span>
                    <motion.div animate={{ rotate: openFaq === i ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronDown className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-4 text-sm text-neutral-500 leading-relaxed">{faq.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
            <div className="text-center mt-6">
              <Link to="/faq" className="text-brand-600 font-medium text-sm hover:text-brand-700 transition-colors">View all FAQs →</Link>
            </div>
          </div>
        </section>
      )}

      {/* ═══════ FINAL CTA ═══════ */}
      <section className="py-10 lg:py-12 bg-white">
        <div className="container-lg">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            className="text-center"
          >
            <h2 className="heading-lg mb-4">Start Your Loan Journey Today</h2>
            <p className="text-neutral-500 mb-8 max-w-lg mx-auto">Submit your enquiry and let our experts guide you to the right loan solution.</p>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setFormOpen(true)}
              className="btn-primary text-base px-8 py-4"
            >
              Get Loan Assistance <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* ═══════ FORM MODAL ═══════ */}
      <AnimatePresence>
        {formOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setFormOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6"
            >
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-lg font-display font-bold text-neutral-900">Loan Enquiry</h2>
                  <p className="text-xs text-neutral-400">Fill in your details to get started</p>
                </div>
                <button onClick={() => setFormOpen(false)} className="p-2 rounded-lg hover:bg-neutral-100 text-neutral-500 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <MultiStepForm onClose={() => setFormOpen(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
