import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Phone, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { testimonialsApi } from '../api';
import { LOAN_TYPES } from '../constants';
import { fadeInUp, staggerContainer, viewportConfig } from '../animations/variants';
import SectionHeader from '../components/ui/SectionHeader';
import MultiStepForm from '../components/forms/MultiStepForm';
import EMICalculatorWidget from '../components/common/EMICalculatorWidget';
import { useToast } from '../components/ui/Toast';

export default function AllLoans() {
  const [formOpen, setFormOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data } = useQuery({
    queryKey: ['testimonials'],
    queryFn: () => testimonialsApi.getAll({ published: 'true' }),
    staleTime: 300000,
  });
  const testimonials = data?.data?.data || [];

  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-50 via-white to-neutral-50 py-8 sm:py-12 lg:py-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(158,30,39,0.10),_transparent_30%)]" />
        <div className="container-xl relative">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="mx-auto max-w-3xl text-center"
          >
            <span className="inline-flex items-center rounded-full border border-brand-200 bg-white px-3 py-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.18em] text-brand-700 shadow-sm">
              Loan Products
            </span>
            <h1 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-neutral-900 leading-tight">
              All loan products
            </h1>
            <p className="mt-4 text-sm sm:text-base text-neutral-600 leading-relaxed">
              Explore tailored financing options built around your personal, business, and life goals.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Loans Grid */}
      <section className="relative -mt-4 pb-12 sm:-mt-6">
        <div className="container-xl">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5"
          >
            {LOAN_TYPES.map((loan) => {
              const IconMap = { 'personal-loan': '👤', 'business-loan': '💼', 'home-loan': '🏠', 'loan-against-property': '🏢', 'car-loan': '🚗', 'education-loan': '🎓', 'gold-loan': '💎', 'debt-consolidation': '🔄' };
              const badgeMap = { 'personal-loan': 'bg-brand-50 text-brand-700', 'business-loan': 'bg-emerald-50 text-emerald-700', 'home-loan': 'bg-violet-50 text-violet-700', 'loan-against-property': 'bg-orange-50 text-orange-700', 'car-loan': 'bg-rose-50 text-rose-700', 'education-loan': 'bg-teal-50 text-teal-700', 'gold-loan': 'bg-amber-50 text-amber-700', 'debt-consolidation': 'bg-indigo-50 text-indigo-700' };
              return (
                <motion.div
                  key={loan.value}
                  variants={fadeInUp}
                  whileHover={{ y: -4 }}
                  className="rounded-[24px] border border-neutral-200 bg-white p-4 shadow-card transition-all duration-300 hover:border-brand-200 hover:shadow-card-hover sm:p-5"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-2xl text-lg ${badgeMap[loan.value]}`}>
                      {IconMap[loan.value]}
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-neutral-900 text-sm sm:text-base leading-snug">{loan.label}</h3>
                      <p className="text-[11px] text-neutral-400">{loan.benefit}</p>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed mb-4">{loan.description}</p>

                  <div className="flex gap-2">
                    <Link
                      to={`/loans/${loan.value}`}
                      className="flex-1 rounded-xl bg-neutral-50 px-3 py-2.5 text-center text-[11px] sm:text-xs font-semibold text-neutral-700 transition-colors hover:bg-brand-50 hover:text-brand-700"
                    >
                      Learn More
                    </Link>
                    <button
                      onClick={() => { setSelectedLoan(loan.value); setFormOpen(true); }}
                      className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-brand-600 px-3 py-2.5 text-[11px] sm:text-xs font-semibold text-white transition-colors hover:bg-brand-700"
                    >
                      Apply <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-8 sm:py-10 lg:py-12">
        <div className="container-lg">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            className="rounded-[30px] border border-neutral-200 bg-neutral-50 p-6 text-center shadow-card sm:p-8"
          >
            <h2 className="font-display font-bold text-neutral-900 text-2xl sm:text-3xl mb-3">Not sure which loan to choose?</h2>
            <p className="mx-auto max-w-xl text-sm sm:text-base text-neutral-500 leading-relaxed mb-6">
              Our experts can help you identify the right loan product for your specific situation.
            </p>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => { setSelectedLoan(''); setFormOpen(true); }}
              className="btn-primary"
            >
              Talk to an Expert <ArrowRight className="w-4 h-4" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Preview */}
      {testimonials.length > 0 && (
        <section className="bg-neutral-50 py-10 sm:py-12 lg:py-16">
          <div className="container-xl">
            <SectionHeader badge="Testimonials" title="Customer Reviews" />
            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {testimonials.slice(0, 3).map(t => (
                <motion.div
                  key={t.id}
                  variants={fadeInUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewportConfig}
                  className="rounded-[24px] border border-neutral-200 bg-white p-4 shadow-card sm:p-5"
                >
                  <div className="mb-3 flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className={`h-4 w-4 ${i < t.rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-200'}`} viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="mb-4 text-sm leading-relaxed text-neutral-600">"{t.review}"</p>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-sm font-bold text-brand-700">{t.name?.[0]}</div>
                    <div>
                      <p className="text-sm font-semibold text-neutral-900">{t.name}</p>
                      <p className="text-xs text-neutral-400">{t.loanType?.replace(/-/g, ' ')}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Form Modal */}
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
                <h2 className="text-lg font-display font-bold text-neutral-900">Loan Enquiry</h2>
                <button onClick={() => setFormOpen(false)} className="p-2 rounded-lg hover:bg-neutral-100 text-neutral-500 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <MultiStepForm initialLoanType={selectedLoan} onClose={() => setFormOpen(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
