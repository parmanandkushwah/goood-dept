import { useState } from 'react';
import { calculateEMI, formatCurrency } from '../../utils';

export default function EMICalculatorWidget() {
  const [principal, setPrincipal] = useState(500000);
  const [rate, setRate] = useState(12);
  const [tenure, setTenure] = useState(36);

  const emi = calculateEMI(principal, rate, tenure);
  const totalAmount = emi * tenure;
  const totalInterest = totalAmount - principal;

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 shadow-card p-6">
      <div className="space-y-5 mb-6">
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-neutral-700">Loan Amount</label>
            <span className="text-sm font-semibold text-brand-600">{formatCurrency(principal)}</span>
          </div>
          <input type="range" min="50000" max="10000000" step="50000" value={principal}
            onChange={e => setPrincipal(+e.target.value)}
            className="w-full h-2 bg-neutral-200 rounded-full appearance-none cursor-pointer" />
        </div>
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-neutral-700">Interest Rate</label>
            <span className="text-sm font-semibold text-brand-600">{rate}% p.a.</span>
          </div>
          <input type="range" min="6" max="30" step="0.5" value={rate}
            onChange={e => setRate(+e.target.value)}
            className="w-full h-2 bg-neutral-200 rounded-full appearance-none cursor-pointer" />
        </div>
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-neutral-700">Tenure</label>
            <span className="text-sm font-semibold text-brand-600">{tenure} months</span>
          </div>
          <input type="range" min="6" max="360" step="6" value={tenure}
            onChange={e => setTenure(+e.target.value)}
            className="w-full h-2 bg-neutral-200 rounded-full appearance-none cursor-pointer" />
        </div>
      </div>
      <div className="bg-brand-50 rounded-xl p-4 space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-neutral-600">Monthly EMI</span>
          <span className="text-xl font-display font-bold text-brand-600">{formatCurrency(emi)}</span>
        </div>
        <div className="flex justify-between text-xs text-neutral-500">
          <span>Total Interest: {formatCurrency(totalInterest)}</span>
          <span>Total: {formatCurrency(totalAmount)}</span>
        </div>
      </div>
      <p className="text-xs text-neutral-400 mt-3">* Indicative calculation only. Actual EMI may vary.</p>
    </div>
  );
}
