import { motion } from 'framer-motion';
import { CheckCircle, Home, ArrowLeft } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { formatCurrency, formatDate, getLoanTypeLabel } from '../utils';
import { COMPANY_PHONE, COMPANY_WHATSAPP } from '../constants';

export default function ThankYou() {
  const { state } = useLocation();
  const lead = state?.lead;

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4 py-20">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}
        className="bg-white rounded-3xl shadow-xl border border-neutral-100 p-8 max-w-md w-full text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-16 h-16 bg-brand-50 border border-brand-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle className="w-8 h-8 text-brand-600" />
        </motion.div>

        <h1 className="text-2xl font-display font-bold text-neutral-900 mb-2">Your Enquiry Is On Its Way</h1>
        <p className="text-neutral-500 text-sm mb-6 leading-relaxed">
          Thanks for choosing Good Debt. Our team will review your requirement and get in touch with you shortly.
        </p>

        {lead && (
          <div className="bg-neutral-50 rounded-2xl p-4 mb-6 text-left space-y-2.5 border border-neutral-100">
            <div className="flex justify-between items-center">
              <span className="text-xs text-neutral-500">Application ID</span>
              <span className="text-sm font-bold text-brand-600">{lead.leadNumber}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-neutral-500">Loan Type</span>
              <span className="text-sm font-medium text-neutral-900">{getLoanTypeLabel(lead.loanType)}</span>
            </div>
            {lead.loanAmount && (
              <div className="flex justify-between items-center">
                <span className="text-xs text-neutral-500">Requested Amount</span>
                <span className="text-sm font-medium text-neutral-900">{formatCurrency(lead.loanAmount)}</span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-xs text-neutral-500">Submitted On</span>
              <span className="text-sm font-medium text-neutral-900">{formatDate(lead.createdAt)}</span>
            </div>
          </div>
        )}

        <p className="text-xs text-neutral-400 mb-6 leading-relaxed">
          Please save your Application ID for future reference. Our team will contact you within 1 business day.
        </p>

        <div className="space-y-3">
          <Link to="/" className="flex items-center justify-center gap-2 w-full px-5 py-3 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 transition-colors text-sm">
            <Home className="w-4 h-4" /> Back to Home
          </Link>
          <a href={`tel:${COMPANY_PHONE}`} className="flex items-center justify-center gap-2 w-full px-5 py-3 bg-neutral-100 text-neutral-700 font-semibold rounded-xl hover:bg-neutral-200 transition-colors text-sm">
            <span className="text-lg">📞</span> Call Good Debt
          </a>
          <a href={`https://wa.me/${COMPANY_WHATSAPP.replace('+', '')}`} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full px-5 py-3 bg-green-50 text-green-700 font-semibold rounded-xl hover:bg-green-100 transition-colors border border-green-200 text-sm">
            WhatsApp Good Debt
          </a>
        </div>
      </motion.div>
    </div>
  );
}
