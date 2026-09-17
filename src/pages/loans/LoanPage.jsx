import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, X, ChevronRight } from 'lucide-react';
import { loanProductsApi } from '../../api';
import { fadeInUp, staggerContainer, viewportConfig } from '../../animations/variants';
import MultiStepForm from '../../components/forms/MultiStepForm';
import EMICalculatorWidget from '../../components/common/EMICalculatorWidget';
import SectionHeader from '../../components/ui/SectionHeader';
import { PageLoader } from '../../components/ui/Spinner';
import { useToast } from '../../components/ui/Toast';
import { getLoanTypeLabel } from '../../utils';

export default function LoanPage() {
  const { slug } = useParams();
  const location = useLocation();
  const { toast } = useToast();
  const [formOpen, setFormOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['loan-product', slug],
    queryFn: () => loanProductsApi.getBySlug(slug),
    staleTime: 300000,
    enabled: !!slug,
  });

  if (isLoading) return <PageLoader />;

  const product = data?.data?.data;
  if (!product) {
    return (
      <div className="pt-16">
        <div className="container-xl py-12 sm:py-16 lg:py-20 text-center">
          <h1 className="heading-lg mb-4">Product Not Found</h1>
          <p className="text-neutral-500 mb-6">This loan product doesn't exist or has been removed.</p>
          <Link to="/loans" className="btn-primary">View All Loans</Link>
        </div>
      </div>
    );
  }

  const parse = (val) => Array.isArray(val) ? val : JSON.parse(val || '[]');
  const benefits = parse(product.benefits);
  const eligibility = parse(product.eligibility);
  const documents = parse(product.documents);

  return (
    <div className="pt-16 overflow-x-hidden w-full max-w-full">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-50 via-white to-neutral-50 py-6 sm:py-8 lg:py-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(158,30,39,0.12),_transparent_30%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(15,118,110,0.08),_transparent_28%)]" />

        <div className="container-xl relative">
          <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="max-w-3xl">
            <Link to="/loans" className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 transition-colors hover:text-brand-700">
              <ChevronRight className="h-4 w-4 rotate-180" /> All Loans
            </Link>

            <h1 className="mt-3 text-[2rem] sm:text-[2.4rem] lg:text-[3.2rem] font-display font-extrabold text-neutral-900 leading-[1.08] max-w-2xl">
              {product.name}
            </h1>
            <p className="mt-4 max-w-xl text-base lg:text-lg text-neutral-600 leading-relaxed">{product.description}</p>

            <div className="mt-6 grid min-w-0 grid-cols-3 gap-2 sm:gap-3">
              {product.interestRateText && (
                <div className="min-w-0 rounded-2xl border border-neutral-200 bg-white px-2 py-3 shadow-sm sm:px-4">
                  <p className="truncate text-[8px] uppercase tracking-[0.1em] text-neutral-400 sm:text-[10px] sm:tracking-[0.16em]">Interest Rate</p>
                  <p className="mt-2 break-words text-[10px] font-semibold leading-tight text-neutral-900 sm:text-sm">{product.interestRateText}</p>
                </div>
              )}
              {product.tenureText && (
                <div className="min-w-0 rounded-2xl border border-neutral-200 bg-white px-2 py-3 shadow-sm sm:px-4">
                  <p className="truncate text-[8px] uppercase tracking-[0.1em] text-neutral-400 sm:text-[10px] sm:tracking-[0.16em]">Tenure</p>
                  <p className="mt-2 break-words text-[10px] font-semibold leading-tight text-neutral-900 sm:text-sm">{product.tenureText}</p>
                </div>
              )}
              {product.maxAmount && (
                <div className="min-w-0 rounded-2xl border border-neutral-200 bg-white px-2 py-3 shadow-sm sm:px-4">
                  <p className="truncate text-[8px] uppercase tracking-[0.1em] text-neutral-400 sm:text-[10px] sm:tracking-[0.16em]">Up to</p>
                  <p className="mt-2 break-words text-[10px] font-semibold leading-tight text-neutral-900 sm:text-sm">₹{(product.maxAmount / 100000).toFixed(0)} Lakh</p>
                </div>
              )}
            </div>

            <div className="mt-8 flex flex-row gap-2 sm:gap-3">
              <motion.button whileTap={{ scale: 0.97 }} onClick={() => setFormOpen(true)}
                className="flex min-w-0 flex-1 items-center justify-center gap-1 rounded-xl bg-brand-600 px-2 py-3.5 text-xs font-semibold text-white shadow-brand-sm transition-colors hover:bg-brand-700 sm:gap-2 sm:px-7 sm:text-sm">
                <span className="truncate">Check Eligibility</span> <ArrowRight className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
              </motion.button>
              <motion.button whileTap={{ scale: 0.97 }} onClick={() => setFormOpen(true)}
                className="flex min-w-0 flex-1 items-center justify-center gap-1 rounded-xl border border-neutral-200 bg-white px-2 py-3.5 text-xs font-semibold text-neutral-700 transition-colors hover:border-brand-300 hover:text-brand-600 sm:gap-2 sm:px-7 sm:text-sm">
                Apply Now
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      {benefits.length > 0 && (
        <section className="bg-white py-10 sm:py-12 lg:py-14">
          <div className="container-xl">
            <SectionHeader badge="Benefits" title={`Why choose ${product.name}`} />
            <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewportConfig}
              className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-4">
              {benefits.map((b, i) => (
                <motion.div key={i} variants={fadeInUp} className="rounded-[20px] border border-neutral-200 bg-neutral-50 p-3 shadow-card transition-transform duration-300 hover:-translate-y-1 sm:p-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-brand-600 sm:h-10 sm:w-10">
                    <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <p className="mt-3 text-[11px] leading-relaxed text-neutral-700 sm:text-sm">{b}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Eligibility & Documents */}
      <section className="bg-neutral-50 py-10 sm:py-12 lg:py-14">
        <div className="container-xl">
          <div className="grid gap-4 md:grid-cols-2">
            {eligibility.length > 0 && (
              <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={viewportConfig} className="rounded-[24px] border border-neutral-200 bg-white p-4 shadow-card sm:p-6">
                <h3 className="font-display font-bold text-neutral-900 text-xl mb-4">Eligibility Criteria</h3>
                <ul className="space-y-3">
                  {eligibility.map((e, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-neutral-600">
                      <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-600">
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span>{e}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-xs text-neutral-400">* Eligibility criteria are indicative and subject to lender policies.</p>
              </motion.div>
            )}
            {documents.length > 0 && (
              <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={viewportConfig} className="rounded-[24px] border border-neutral-200 bg-white p-4 shadow-card sm:p-6">
                <h3 className="font-display font-bold text-neutral-900 text-xl mb-4">Documents Required</h3>
                <ul className="space-y-3">
                  {documents.map((d, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-neutral-600">
                      <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">{i + 1}</span>
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-xs text-neutral-400">* Document requirements may vary by lender.</p>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* EMI Calculator */}
      <section className="bg-white py-10 sm:py-12 lg:py-14">
        <div className="container-xl">
          <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-12">
            <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={viewportConfig}>
              <span className="inline-flex items-center rounded-full bg-brand-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-700">EMI Calculator</span>
              <h2 className="mt-4 text-2xl sm:text-3xl font-display font-bold text-neutral-900">Calculate your EMI</h2>
              <p className="mt-4 max-w-lg text-sm sm:text-base text-neutral-600 leading-relaxed">
                Estimate your monthly payments for a {product.name}. Use this as a planning tool before submitting your enquiry.
              </p>
              <motion.button whileTap={{ scale: 0.97 }} onClick={() => setFormOpen(true)} className="mt-6 btn-primary">
                Get {product.name} Assistance <ArrowRight className="h-4 w-4" />
              </motion.button>
            </motion.div>
            <EMICalculatorWidget />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-neutral-50 py-10 sm:py-12 lg:py-14">
        <div className="container-lg">
          <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={viewportConfig} className="rounded-[30px] border border-neutral-200 bg-white p-6 text-center shadow-card sm:p-8">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-neutral-900">Ready to apply for a {product.name}?</h2>
            <p className="mt-3 mx-auto max-w-lg text-sm sm:text-base text-neutral-500 leading-relaxed">
              Submit your enquiry and our team will guide you through the entire process.
            </p>
            <motion.button whileTap={{ scale: 0.97 }} onClick={() => setFormOpen(true)}
              className="mt-6 inline-flex items-center gap-2 rounded-xl border border-brand-200 bg-brand-50 px-8 py-3.5 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-100">
              Submit Loan Enquiry
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Form Modal */}
      <AnimatePresence>
        {formOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setFormOpen(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-display font-bold text-neutral-900">{product.name} Enquiry</h2>
                <button onClick={() => setFormOpen(false)} className="p-2 rounded-lg hover:bg-neutral-100 text-neutral-500 transition-colors"><X className="w-5 h-5" /></button>
              </div>
              <MultiStepForm initialLoanType={product.value} onClose={() => setFormOpen(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
