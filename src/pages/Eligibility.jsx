import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle, AlertCircle, X } from 'lucide-react';
import { LOAN_TYPES, EMPLOYMENT_TYPES, CIBIL_OPTIONS } from '../constants';
import { fadeInUp, viewportConfig } from '../animations/variants';
import MultiStepForm from '../components/forms/MultiStepForm';
import SectionHeader from '../components/ui/SectionHeader';
import { useToast } from '../components/ui/Toast';

function calcEligibility({ loanType, monthlyIncome, existingEmi, cibilScore, requestedAmount }) {
  const income = parseFloat(monthlyIncome) || 0;
  const emi = parseFloat(existingEmi) || 0;
  const available = income - emi;
  const maxEmiAllowed = available * 0.5;
  const maxTenure = loanType === 'home-loan' ? 240 : loanType === 'loan-against-property' ? 180 : 60;
  const rate = 12;
  const r = rate / 12 / 100;
  const maxLoan = maxEmiAllowed * ((Math.pow(1 + r, maxTenure) - 1) / (r * Math.pow(1 + r, maxTenure)));
  let cibilOk = true;
  if (cibilScore === 'below-550') cibilOk = false;
  const requested = parseFloat(requestedAmount) || 0;
  const eligible = cibilOk && maxLoan > 0 && (requested === 0 || maxLoan >= requested * 0.7);
  return { eligible, maxLoan: Math.round(maxLoan), cibilOk, available };
}

export default function Eligibility() {
  const [form, setForm] = useState({ loanType: '', monthlyIncome: '', employmentType: '', existingEmi: '', cibilScore: '', requestedAmount: '' });
  const [result, setResult] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const { toast } = useToast();

  const update = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const check = () => {
    if (!form.loanType || !form.monthlyIncome || !form.cibilScore) return;
    setResult(calcEligibility(form));
  };

  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-50 via-white to-neutral-50 py-8 sm:py-12 lg:py-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(158,30,39,0.10),_transparent_35%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(15,118,110,0.08),_transparent_28%)]" />
        <div className="container-xl relative">
          <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center rounded-full border border-brand-200 bg-white px-3 py-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.18em] text-brand-700 shadow-sm">
              Eligibility Checker
            </span>
            <h1 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-neutral-900 leading-tight">
              Check your borrowing potential
            </h1>
            <p className="mt-4 text-sm sm:text-base text-neutral-600 leading-relaxed">
              Get a quick estimate of your loan eligibility and understand where you stand before applying.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3 text-xs sm:text-sm text-neutral-600">
              {['Fast estimate', 'No credit impact', 'Expert guidance'].map((item) => (
                <span key={item} className="inline-flex items-center rounded-full border border-neutral-200 bg-white px-3 py-1.5 shadow-sm">
                  {item}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative -mt-4 pb-12 sm:-mt-6">
        <div className="container-lg">
          <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={viewportConfig} className="rounded-[28px] border border-neutral-200 bg-white p-4 shadow-card sm:p-6 lg:p-8">
            <div className="mb-6 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">Indicative check</p>
                <h2 className="mt-2 font-display font-bold text-neutral-900 text-xl sm:text-2xl">Check your eligibility</h2>
              </div>
              <span className="hidden sm:inline-flex items-center rounded-full bg-neutral-100 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-600">
                2 min read
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="label">Loan Type *</label>
                <select value={form.loanType} onChange={e => update('loanType', e.target.value)} className="input-field focus:border-brand-300 focus:ring-2 focus:ring-brand-100">
                  <option value="">Select Loan Type</option>
                  {LOAN_TYPES.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Employment Type</label>
                <select value={form.employmentType} onChange={e => update('employmentType', e.target.value)} className="input-field focus:border-brand-300 focus:ring-2 focus:ring-brand-100">
                  <option value="">Select</option>
                  {EMPLOYMENT_TYPES.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Monthly Income (₹) *</label>
                <input type="number" placeholder="e.g. 50000" value={form.monthlyIncome} onChange={e => update('monthlyIncome', e.target.value)} className="input-field focus:border-brand-300 focus:ring-2 focus:ring-brand-100" />
              </div>
              <div>
                <label className="label">Existing Monthly EMI (₹)</label>
                <input type="number" placeholder="0 if none" value={form.existingEmi} onChange={e => update('existingEmi', e.target.value)} className="input-field focus:border-brand-300 focus:ring-2 focus:ring-brand-100" />
              </div>
              <div>
                <label className="label">CIBIL Score Range *</label>
                <select value={form.cibilScore} onChange={e => update('cibilScore', e.target.value)} className="input-field focus:border-brand-300 focus:ring-2 focus:ring-brand-100">
                  <option value="">Select</option>
                  {CIBIL_OPTIONS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Requested Loan Amount (₹)</label>
                <input type="number" placeholder="Optional" value={form.requestedAmount} onChange={e => update('requestedAmount', e.target.value)} className="input-field focus:border-brand-300 focus:ring-2 focus:ring-brand-100" />
              </div>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between sm:border-t sm:border-neutral-200 sm:pt-5">
              <p className="text-[11px] text-neutral-500">Required fields marked with *</p>
              <motion.button whileTap={{ scale: 0.97 }} onClick={check}
                disabled={!form.loanType || !form.monthlyIncome || !form.cibilScore}
                className="btn-primary w-full sm:w-auto disabled:opacity-40 disabled:cursor-not-allowed">
                Check Eligibility
              </motion.button>
            </div>
          </motion.div>

          <AnimatePresence>
            {result && (
              <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className={`mt-6 overflow-hidden rounded-[28px] border-2 p-5 sm:p-6 ${result.eligible ? 'border-green-200 bg-green-50/60' : 'border-brand-200 bg-brand-50/70'}`}>
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${result.eligible ? 'bg-green-100 text-green-700' : 'bg-brand-100 text-brand-700'}`}>
                    {result.eligible ? <CheckCircle className="h-6 w-6" /> : <AlertCircle className="h-6 w-6" />}
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <h3 className={`font-display font-bold text-xl sm:text-2xl ${result.eligible ? 'text-green-800' : 'text-brand-800'}`}>
                        {result.eligible ? 'You may be eligible' : 'Eligibility needs review'}
                      </h3>
                      <span className={`inline-flex w-fit items-center rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${result.eligible ? 'bg-green-100 text-green-700' : 'bg-brand-100 text-brand-700'}`}>
                        {result.eligible ? 'Likely eligible' : 'Needs review'}
                      </span>
                    </div>

                    <p className={`mt-3 text-sm leading-relaxed ${result.eligible ? 'text-green-700' : 'text-brand-700'}`}>
                      {result.eligible
                        ? `Based on the information provided, you may be eligible to explore suitable loan options. Indicative maximum loan amount: ₹${result.maxLoan.toLocaleString('en-IN')}.`
                        : !result.cibilOk
                          ? 'A CIBIL score below 550 may affect loan eligibility. We recommend improving your credit score before applying.'
                          : 'Based on the information provided, your current income and obligations may limit eligibility. Our team can provide personalized guidance.'}
                    </p>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl bg-white/70 p-3 shadow-sm">
                        <p className="text-[10px] uppercase tracking-[0.18em] text-neutral-500">Indicative loan</p>
                        <p className="mt-2 text-lg font-display font-bold text-neutral-900">₹{result.maxLoan.toLocaleString('en-IN')}</p>
                      </div>
                      <div className="rounded-2xl bg-white/70 p-3 shadow-sm">
                        <p className="text-[10px] uppercase tracking-[0.18em] text-neutral-500">Available after EMI</p>
                        <p className="mt-2 text-lg font-display font-bold text-neutral-900">₹{Math.round(result.available).toLocaleString('en-IN')}</p>
                      </div>
                    </div>

                    <p className="mt-4 text-xs text-neutral-600 leading-relaxed">
                      <strong>Important:</strong> Eligibility is indicative only. Final approval, loan amount, interest rate and terms are determined by the respective lender based on its policies and credit assessment.
                    </p>

                    <motion.button whileTap={{ scale: 0.97 }} onClick={() => setFormOpen(true)}
                      className="mt-5 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-brand-sm transition-colors hover:bg-brand-700">
                      Get Expert Assistance <ArrowRight className="h-4 w-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-xs leading-relaxed text-amber-800">
              <strong>Disclaimer:</strong> This calculator provides indicative results for planning purposes only. Good Debt does not guarantee loan approval. Final eligibility, loan amount, interest rate and terms are subject to the respective lender’s policies and assessment.
            </p>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {formOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setFormOpen(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-5 sm:p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-display font-bold text-neutral-900">Loan Enquiry</h2>
                <button onClick={() => setFormOpen(false)} className="p-2 rounded-lg hover:bg-neutral-100 text-neutral-500 transition-colors"><X className="w-5 h-5" /></button>
              </div>
              <MultiStepForm initialLoanType={form.loanType} onClose={() => setFormOpen(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
