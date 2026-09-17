import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { leadsApi } from '../../api';
import { getUTMParams } from '../../utils';
import { LOAN_TYPES, LOAN_AMOUNTS, EMPLOYMENT_TYPES, CIBIL_OPTIONS, INDIAN_STATES } from '../../constants';
import { useToast } from '../ui/Toast';

const formStepVariants = {
  enter: (dir) => ({ x: dir > 0 ? 50 : -50, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.25, ease: 'easeOut' } },
  exit: (dir) => ({ x: dir < 0 ? 50 : -50, opacity: 0, transition: { duration: 0.2 } }),
};

const TOTAL_STEPS = 9;

function OptionCard({ selected, onClick, children, className = '' }) {
  return (
    <motion.button type="button" whileTap={{ scale: 0.97 }} onClick={onClick}
      className={`w-full text-left px-4 py-3 rounded-xl border-2 font-medium text-sm transition-all duration-150 ${selected ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-neutral-200 bg-white text-neutral-700 hover:border-brand-300 hover:bg-neutral-50'} ${className}`}
    >
      {children}
    </motion.button>
  );
}

export default function MultiStepForm({ initialLoanType = '', onClose }) {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ loanType: initialLoanType, loanAmount: '', customAmount: '', employmentType: '', monthlyIncome: '', hasExistingEmi: '', existingEmiAmount: '', cibilScore: '', city: '', state: '', fullName: '', mobile: '', email: '', consent: false });
  const { toast } = useToast();
  const navigate = useNavigate();

  const update = (key, value) => setFormData(prev => ({ ...prev, [key]: value }));

  const goNext = () => { setDirection(1); setStep(s => Math.min(s + 1, TOTAL_STEPS)); };
  const goBack = () => { setDirection(-1); setStep(s => Math.max(s - 1, 1)); };

  const canProceed = () => {
    switch (step) {
      case 1: return !!formData.loanType;
      case 2: return !!formData.loanAmount || (formData.loanAmount === 'custom' && formData.customAmount);
      case 3: return !!formData.employmentType;
      case 4: return !!formData.monthlyIncome;
      case 5: return !!formData.hasExistingEmi;
      case 6: return !!formData.cibilScore;
      case 7: return !!formData.city && !!formData.state;
      case 8: return !!formData.fullName && /^[6-9]\d{9}$/.test(formData.mobile);
      case 9: return formData.consent;
      default: return true;
    }
  };

  const handleSubmit = async () => {
    if (!canProceed()) return;
    setLoading(true);
    try {
      const utmParams = getUTMParams();
      const payload = {
        loanType: formData.loanType,
        loanAmount: formData.loanAmount === 'custom' ? formData.customAmount : formData.loanAmount,
        employmentType: formData.employmentType,
        monthlyIncome: formData.monthlyIncome,
        existingEmi: formData.hasExistingEmi === 'yes' ? formData.existingEmiAmount : 0,
        cibilScore: formData.cibilScore,
        city: formData.city,
        state: formData.state,
        fullName: formData.fullName,
        mobile: formData.mobile,
        email: formData.email,
        ...utmParams,
      };
      const res = await leadsApi.create(payload);
      navigate('/thank-you', { state: { lead: res.data.data } });
    } catch (err) {
      toast(err.response?.data?.message || 'Something went wrong. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const progress = ((step - 1) / (TOTAL_STEPS - 1)) * 100;

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-neutral-500">Step {step} of {TOTAL_STEPS}</span>
          <span className="text-xs font-medium text-brand-600">{Math.round(progress)}% complete</span>
        </div>
        <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
          <motion.div className="h-full bg-brand-600 rounded-full" animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }} />
        </div>
      </div>

      {/* Step Content */}
      <div className="overflow-hidden min-h-[320px]">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div key={step} custom={direction} variants={formStepVariants} initial="enter" animate="center" exit="exit">

            {step === 1 && (
              <div>
                <h3 className="text-lg font-display font-bold text-neutral-900 mb-1">What type of loan are you looking for?</h3>
                <p className="text-sm text-neutral-500 mb-4">Select the loan that best fits your need</p>
                <div className="grid grid-cols-2 gap-2">
                  {LOAN_TYPES.map(lt => (
                    <OptionCard key={lt.value} selected={formData.loanType === lt.value} onClick={() => update('loanType', lt.value)}>
                      {lt.label}
                    </OptionCard>
                  ))}
                  <OptionCard selected={formData.loanType === 'other'} onClick={() => update('loanType', 'other')}>Other</OptionCard>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h3 className="text-lg font-display font-bold text-neutral-900 mb-1">How much loan do you need?</h3>
                <p className="text-sm text-neutral-500 mb-4">Select an approximate amount</p>
                <div className="grid grid-cols-2 gap-2">
                  {LOAN_AMOUNTS.map(a => (
                    <OptionCard key={a.value} selected={formData.loanAmount === a.value} onClick={() => update('loanAmount', a.value)}>
                      {a.label}
                    </OptionCard>
                  ))}
                </div>
                {formData.loanAmount === 'custom' && (
                  <div className="mt-3">
                    <input type="number" placeholder="Enter amount in ₹" value={formData.customAmount}
                      onChange={e => update('customAmount', e.target.value)}
                      className="input-field" />
                  </div>
                )}
              </div>
            )}

            {step === 3 && (
              <div>
                <h3 className="text-lg font-display font-bold text-neutral-900 mb-1">What is your employment type?</h3>
                <p className="text-sm text-neutral-500 mb-4">This helps us find suitable options</p>
                <div className="grid grid-cols-2 gap-2">
                  {EMPLOYMENT_TYPES.map(e => (
                    <OptionCard key={e.value} selected={formData.employmentType === e.value} onClick={() => update('employmentType', e.value)}>
                      {e.label}
                    </OptionCard>
                  ))}
                </div>
              </div>
            )}

            {step === 4 && (
              <div>
                <h3 className="text-lg font-display font-bold text-neutral-900 mb-1">What is your monthly income?</h3>
                <p className="text-sm text-neutral-500 mb-4">Enter your approximate monthly income</p>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 font-medium">₹</span>
                  <input type="number" placeholder="e.g. 50000" value={formData.monthlyIncome}
                    onChange={e => update('monthlyIncome', e.target.value)}
                    className="input-field pl-8" />
                </div>
                <p className="text-xs text-neutral-400 mt-2">Your income information is kept confidential</p>
              </div>
            )}

            {step === 5 && (
              <div>
                <h3 className="text-lg font-display font-bold text-neutral-900 mb-1">Do you have any existing EMIs?</h3>
                <p className="text-sm text-neutral-500 mb-4">Include all current loan EMIs</p>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <OptionCard selected={formData.hasExistingEmi === 'no'} onClick={() => update('hasExistingEmi', 'no')}>No existing EMIs</OptionCard>
                  <OptionCard selected={formData.hasExistingEmi === 'yes'} onClick={() => update('hasExistingEmi', 'yes')}>Yes, I have EMIs</OptionCard>
                </div>
                {formData.hasExistingEmi === 'yes' && (
                  <div className="relative mt-2">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 font-medium">₹</span>
                    <input type="number" placeholder="Total monthly EMI amount" value={formData.existingEmiAmount}
                      onChange={e => update('existingEmiAmount', e.target.value)}
                      className="input-field pl-8" />
                  </div>
                )}
              </div>
            )}

            {step === 6 && (
              <div>
                <h3 className="text-lg font-display font-bold text-neutral-900 mb-1">What is your CIBIL score?</h3>
                <p className="text-sm text-neutral-500 mb-4">Select the range that applies to you</p>
                <div className="grid grid-cols-2 gap-2">
                  {CIBIL_OPTIONS.map(c => (
                    <OptionCard key={c.value} selected={formData.cibilScore === c.value} onClick={() => update('cibilScore', c.value)}>
                      {c.label}
                    </OptionCard>
                  ))}
                </div>
              </div>
            )}

            {step === 7 && (
              <div>
                <h3 className="text-lg font-display font-bold text-neutral-900 mb-1">Where are you located?</h3>
                <p className="text-sm text-neutral-500 mb-4">Enter your current city and state</p>
                <div className="space-y-3">
                  <input type="text" placeholder="City" value={formData.city} onChange={e => update('city', e.target.value)} className="input-field" />
                  <select value={formData.state} onChange={e => update('state', e.target.value)} className="input-field">
                    <option value="">Select State</option>
                    {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            )}

            {step === 8 && (
              <div>
                <h3 className="text-lg font-display font-bold text-neutral-900 mb-1">Your contact details</h3>
                <p className="text-sm text-neutral-500 mb-4">Our team will reach out to assist you</p>
                <div className="space-y-3">
                  <input type="text" placeholder="Full Name *" value={formData.fullName} onChange={e => update('fullName', e.target.value)} className="input-field" />
                  <input type="tel" placeholder="Mobile Number * (10 digits)" value={formData.mobile} onChange={e => update('mobile', e.target.value)} maxLength={10} className="input-field" />
                  {formData.mobile && !/^[6-9]\d{9}$/.test(formData.mobile) && (
                    <p className="text-xs text-brand-500">Enter a valid 10-digit Indian mobile number</p>
                  )}
                  <input type="email" placeholder="Email Address (optional)" value={formData.email} onChange={e => update('email', e.target.value)} className="input-field" />
                </div>
              </div>
            )}

            {step === 9 && (
              <div>
                <h3 className="text-lg font-display font-bold text-neutral-900 mb-1">Almost done!</h3>
                <p className="text-sm text-neutral-500 mb-4">Please review and confirm your submission</p>
                <div className="bg-neutral-50 rounded-xl p-4 mb-4 space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-neutral-500">Loan Type</span><span className="font-medium capitalize">{formData.loanType?.replace(/-/g, ' ')}</span></div>
                  <div className="flex justify-between"><span className="text-neutral-500">Amount</span><span className="font-medium">₹{(formData.loanAmount === 'custom' ? formData.customAmount : formData.loanAmount)?.toLocaleString('en-IN')}</span></div>
                  <div className="flex justify-between"><span className="text-neutral-500">Employment</span><span className="font-medium capitalize">{formData.employmentType?.replace(/-/g, ' ')}</span></div>
                  <div className="flex justify-between"><span className="text-neutral-500">City</span><span className="font-medium">{formData.city}, {formData.state}</span></div>
                  <div className="flex justify-between"><span className="text-neutral-500">Name</span><span className="font-medium">{formData.fullName}</span></div>
                  <div className="flex justify-between"><span className="text-neutral-500">Mobile</span><span className="font-medium">{formData.mobile}</span></div>
                </div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={formData.consent} onChange={e => update('consent', e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-neutral-300 text-brand-600 focus:ring-brand-500" />
                  <span className="text-xs text-neutral-600 leading-relaxed">
                    I agree to be contacted by Good Debt regarding my loan enquiry and understand that final loan approval, interest rate, amount and terms are subject to the respective lender's eligibility criteria and policies.
                  </span>
                </label>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-neutral-100">
        <button type="button" onClick={goBack} disabled={step === 1}
          className="flex items-center gap-1 px-4 py-2.5 text-sm font-medium text-neutral-600 rounded-xl hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        {step < TOTAL_STEPS ? (
          <motion.button type="button" whileTap={{ scale: 0.97 }} onClick={goNext} disabled={!canProceed()}
            className="flex items-center gap-1 px-6 py-2.5 bg-brand-600 text-white text-sm font-semibold rounded-xl hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
            Continue <ChevronRight className="w-4 h-4" />
          </motion.button>
        ) : (
          <motion.button type="button" whileTap={{ scale: 0.97 }} onClick={handleSubmit} disabled={!canProceed() || loading}
            className="flex items-center gap-2 px-6 py-2.5 bg-brand-600 text-white text-sm font-semibold rounded-xl hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
            {loading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Check className="w-4 h-4" />}
            Submit Enquiry
          </motion.button>
        )}
      </div>
    </div>
  );
}
